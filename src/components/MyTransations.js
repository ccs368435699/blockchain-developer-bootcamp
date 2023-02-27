import { useSelector } from 'react-redux';
import { myOpenOrdersSelector } from '../store/selectors'
const MyTranctions = ()=>{

    const MyTranctions = useSelector(myOpenOrdersSelector);
    console.log('MyTranctions', MyTranctions)

    return (
        <div className="component exchange__transactions">
            <div>
                <div className="component__header flex-between">
                    <h2>My Orders</h2>
                    <div className="tabs">
                        <button className="tab tab--active">Orders</button>
                        <button className="tab">Trades</button>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MyTranctions;