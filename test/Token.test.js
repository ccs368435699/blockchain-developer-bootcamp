const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {

    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Token", () => {
    let token, accounts, deployer, receiver, exchange;
    beforeEach(async () => {
        const Token = await ethers.getContractFactory('Token')
        token = await Token.deploy('Dapp University', 'DAPP', '1000000')

        accounts = await ethers.getSigners();
        deployer = accounts[0];
        receiver = accounts[1];
        exchange = accounts[2];

    })
    describe('Deployment', () => {
        const name = 'Dapp University'
        const symbol = 'DAPP';
        const decimals = '18';
        const totalSupply = tokens(1000000)
        // Test go inside here...
        it("has correct name", async () => {
            // Fetch Token from Blockchain       
            const name = await token.name()
            // Read token name
            // check that name is correct       
            expect(name).to.equal(name)

        })
        it("has correct symbol", async () => {
            // Fetch Token from Blockchain        
            const symbol = await token.symbol()
            // check that name is correct       
            expect(symbol).to.equal(symbol)
        })
        it("has correct decimal ", async () => {
            // check that decimal is correct       
            expect(await token.decimals()).to.equal(decimals);
        })
        it("has correct total supply ", async () => {
            // check that name is correct  
            const value = tokens(1000000)
            // const value = ethers.utils.parseUnits('1000000', 'ether')    
            expect(await token.totalSupply()).to.equal(totalSupply)

        })
        it("has correct balanceOf ", async () => {
            // check that name is correct  
            const value = tokens(1000000)
            // const value = ethers.utils.parseUnits('1000000', 'ether')    
            expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)

        })
    })

    describe('Sending Token', () => {
        let amount, transaction, result;

        describe('Success', ()=>{
            beforeEach(async () => {
                amount = tokens(100);
                transaction = await token.connect(deployer).transfer(receiver.address, amount)
                result = await transaction.wait()
            })
    
            it('Transfers token balance', async () => {
                expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
                expect(await token.balanceOf(receiver.address)).to.equal(amount)
    
                console.log('deployer address', await token.balanceOf(deployer.address))
                console.log('reciever address', await token.balanceOf(receiver.address))
                // Ensure that tokens were transfered
    
            })
            it('Transfer event was emited!', async () => {
               // console.log('event', result)
                let event = result.events[0];
    
                expect(event.event).to.equal('Transfer');
                const args = event.args;
                //console.log('args', args)
                expect(args.from).to.equal(deployer.address);
                expect(args.to).to.equal(receiver.address);
                expect(args.value).to.equal(amount)
    
    
            })
        })

        describe('Failure', ()=>{
            it('refect insufficient balances', async ()=>{
                // Transfer more tokens than deployer has 0000000000000000000000000000000000000000
               const invaliAmount = tokens(100000000)
               await  expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000', invaliAmount)) 
                .to.be.reverted;
               
            })
        })

       
    })

    describe('Approving Tokens', ()=>{
        let amount, transaction, result;

        beforeEach(async ()=>{
            amount = tokens(100)
            transaction = await token.connect(deployer).approve(exchange.address, amount)
            result = await transaction.wait()
            
        })
        describe('Success', ()=>{
            console.log('amount', amount)
            it('allocate an allowance for delegated token spending', async ()=>{
               
               expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount)
            })

            it('Approval event was emited!', async () => {                          
                 let event = result.events[0];                
                 expect(event.event).to.equal('Approval');
                 const args = event.args;
                
                 expect(args.owner).to.equal(deployer.address);
                 expect(args.spender).to.equal(exchange.address);
                 expect(args.value).to.equal(amount);   
     
             })

        })
        describe('Failure',()=>{

            it('refect insufficient balances', async ()=>{      
               await  expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000', amount)) 
                .to.be.reverted;
               
            })
            
        })
    })

    describe('Delegated token', ()=>{

        let  amount, transaction, result;
        beforeEach(async ()=>{
            amount = tokens(100);
            transaction = await token.connect(deployer).approve(exchange.address, amount);
            result = await transaction.wait()

        })

        describe('Success',()=>{
            beforeEach(async ()=>{
                transaction = await token.connect(exchange).transferFrom(deployer.address, receiver.address, amount);
                result = transaction.wait();
            })
            it('Transfer token balances', async ()=>{
                expect(await token.balanceOf(deployer.address)).to.be.equal(ethers.utils.parseUnits("999900", "ether"));
                expect(await token.balanceOf(receiver.address)).to.be.equal(amount);


            })

        })

        describe('Failure',()=>{
            
        })
    })


})
