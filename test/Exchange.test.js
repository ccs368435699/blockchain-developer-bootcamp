const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {

    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Exchange', () => {
    let exchange, deployer, accounts, feeAccount;
    const feePercent = 10;
    beforeEach(async () => {

        const Token = await ethers.getContractFactory('Token');
        const Exchange = await ethers.getContractFactory('Exchange');

        token1 = await Token.deploy('Dapp University', 'DAPP', '1000000');
        token2 = await Token.deploy('Mock Dai', 'mDAPP', '1000000');

        accounts = await ethers.getSigners();
        deployer = accounts[0];
        feeAccount = accounts[1];
        user1 = accounts[2];
        user2 = accounts[3];

        let transaction = await token1.connect(deployer).transfer(user1.address, tokens(100))
        await transaction.wait();

        exchange = await Exchange.deploy(feeAccount.address, feePercent);
        // console.log(123, exchange)     

    })

    describe('Doployment', () => {
        it('tracks the fee account', async () => {

            expect(await exchange.feeAccount()).to.be.equal(feeAccount.address);

        })
        it('tracks the fee percent', async () => {
            expect(await exchange.feePercent()).to.equal(feePercent)
        })

    })

    describe('Depositing Tokens', () => {
        let transaction, result;
        let amount = tokens(10);

        beforeEach(async () => {
            // Approve Token
            transaction = await token1.connect(user1).approve(exchange.address, amount)
            result = await transaction.wait();
            // Deposit Token
            transaction = await exchange.connect(user1).depositToken(token1.address, amount)
            result = await transaction.wait();

        })

        describe('Success', () => {
            it('track the token deposit', async () => {
                expect(await token1.balanceOf(exchange.address)).to.be.equal(amount);
                expect(await exchange.tokens(token1.address, user1.address)).to.equal(tokens(10));
                expect(await exchange.balanceOf(token1.address, user1.address)).to.equal(tokens(10));
            })

            it('emits a Deposit event', async () => {
                const event = result.events[1];// 2 events emits?
                expect(event.event).to.equal('Deposit');

                const args = event.args;
                expect(args.token).to.equal(token1.address);
                expect(args.user).to.equal(user1.address);
                expect(args.amount).to.equal(amount);
                expect(args.balance).to.equal(tokens(10));
            })
        })

        describe('Failure', () => {
            it('fails when no tokens are approved', async () => {
                await expect(exchange.connect(user1).depositToken(token1.address, amount)).to.be.reverted;
            })
        })
    })

    describe('Withdraw', () => {
        let transaction, result;
        let amount = tokens(10);

        describe('Success', () => {
            beforeEach(async () => {
                transaction = await token1.connect(user1).approve(exchange.address, amount);
                result = await transaction.wait();

                transaction = await exchange.connect(user1).depositToken(token1.address, amount);
                result = await transaction.wait();

                transaction = await exchange.connect(user1).withdrawToken(token1.address, amount);
                result = await transaction.wait();

            })

            it('withdraw token funds', async () => {
                expect(await token1.balanceOf(exchange.address)).to.equal(0);
                expect(await exchange.tokens(token1.address, user1.address)).to.be.equal(0);
                expect(await exchange.balanceOf(token1.address, user1.address)).to.be.equal(0);
            })

            it('emit withdraw event', async () => {
                const event = result.events[1];// 2 events emits?
                expect(event.event).to.equal('Withdraw');

                const args = event.args;
                expect(args.token).to.equal(token1.address);
                expect(args.user).to.equal(user1.address);
                expect(args.amount).to.equal(amount);
                expect(args.balanceOf).to.equal(tokens(0));
            })
        })
        describe('Failure', () => {
            it('fails when withdraw transfer', async () => {
                await expect(exchange.connect(user1).withdrawToken(token1.address, amount)).to.be.reverted;
            })
        })
    })
    describe('Checking balances', () => {
        it('exchange balance', async () => {
            expect(await exchange.balanceOf(token1.address, user1.address)).to.be.equal(0);
        })
    })

    describe('Make order', () => {
        let transaction, result;
        let amount = tokens(1);

        describe('Sucess', () => {
            beforeEach(async () => {

                // Approve token
                transaction = await token1.connect(user1).approve(exchange.address, amount);
                result = await transaction.wait();
                // Deposit token
                transaction = await exchange.connect(user1).depositToken(token1.address, amount);
                result = await transaction.wait();

                // Make order
                transaction = await exchange.connect(user1).makeOrder(
                    token2.address,
                    tokens(1),
                    token1.address,
                    tokens(1)
                );
                result = await transaction.wait();

            })

            it('track the newly created order', async () => {
                expect(await exchange.orderCount()).to.be.equal(1)
            })
            it('emit Order event', () => {
                const event = result.events[0];// 2 events emits?

                expect(event.event).to.equal('Order');

                const args = event.args;
                expect(args.id).to.equal(1);
                expect(args.user).to.equal(user1.address);
                expect(args.tokenGive).to.equal(token1.address);
                expect(args.amountGive).to.equal(tokens(1));
                expect(args.tokenGet).to.equal(token2.address);
                expect(args.amountGet).to.equal(tokens(1));
                expect(args.timestamp).to.at.least(1);
            })
        })


        describe('Failure', () => {
            it('Reject with no balance', async () => {
                await expect(exchange.connect(user1).makeOrder(
                    token2.address,
                    tokens(1),
                    token1.address,
                    tokens(1))).to.be.reverted;

            })
        })

    })

    describe('Order actions', () => {
        let transaction, result;
        let amount = tokens(1);
        // beforeEach(async () => {

        //     transaction = await token1.connect(user1).approve(exchange.address, amount);
        //     result = await transaction.wait()

        //     transaction = await exchange.connect(user1).depositToken(token1.address, amount);
        //     result = await transaction.wait();

        //     transaction = await exchange.connect(user1).makeOrder(token2.address, amount, token1.address, amount);
        //     result = await transaction.wait();
        // })

        describe('Cancelling orders', async () => {
            beforeEach(async () => {

                transaction = await token1.connect(user1).approve(exchange.address, amount);
                result = await transaction.wait()
    
                transaction = await exchange.connect(user1).depositToken(token1.address, amount);
                result = await transaction.wait();
    
                transaction = await exchange.connect(user1).makeOrder(token2.address, amount, token1.address, amount);
                result = await transaction.wait();
            })

            describe('Sucess', async () => {
                beforeEach(async () => {

                    transaction = await exchange.connect(user1).cancelOrder(1);
                    result = await transaction.wait();
                })

                it('updates cancelled orders', async () => {
                    expect(await exchange.orderCancelled(1)).to.equal(true)
                })

                it('emit Order to cancel event', () => {

                    const event = result.events[0];// 2 events emits?
                    expect(event.event).to.equal('Cancel');

                    const args = event.args;
                    expect(args.id).to.equal(1);
                    expect(args.user).to.equal(user1.address);
                    expect(args.tokenGive).to.equal(token1.address);
                    expect(args.amountGive).to.equal(tokens(1));
                    expect(args.tokenGet).to.equal(token2.address);
                    expect(args.amountGet).to.equal(tokens(1));
                    expect(args.timestamp).to.at.least(1);
                })
            })

            describe('Failure', async () => {   
                beforeEach(async () => {

                    transaction = await token1.connect(user1).approve(exchange.address, amount);
                    result = await transaction.wait()
        
                    transaction = await exchange.connect(user1).depositToken(token1.address, amount);
                    result = await transaction.wait();
        
                    transaction = await exchange.connect(user1).makeOrder(token2.address, amount, token1.address, amount);
                    result = await transaction.wait();
                })
                      

                it('Reject invalid order ids', async () => {
                    const invalidOrderId = 99999;
                    await expect(exchange.connect(user1).cancelOrder(invalidOrderId)).to.be.reverted;

                })
                it('Reject unautherized cancelations', async () => {                   
                    await expect(exchange.connect(user2).cancelOrder(1)).to.be.reverted;

                })

            })

        })


    })
})