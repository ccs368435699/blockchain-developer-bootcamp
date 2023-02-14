export const provider = (state = {}, action) => {
    switch (action.type) {
        case 'PROVIDER_LOADED':
            return {
                ...state,
                connection: action.connection
            }
        case 'NETWORK_LOADED':
            return {
                ...state,
                chainId: action.chainId
            }
        case 'Account_LOADED':
            return {
                ...state,
                chainId: action.account
            }
        case 'ETHER_BALANCE_LOADED':
            return {
                ...state,
                balance: action.balance
            }
        default:
            return state
    }
}

export const tokens = (state = { load: false, contracts: [], symbols: [] }, action) => {
    switch (action.type) {
        case 'TOKEN_1_LOADED':
            return {
                ...state,
                loaded: true,
                contracts: [...state.contracts, action.token],
                symbols: [...state.symbols, action.symbol]
            }
        case 'TOKEN_2_LOADED':
            return {
                ...state,
                loaded: true,
                contracts: [...state.contracts, action.token],
                symbols: [...state.symbols, action.symbol]
            }
        case 'EXCHANGE_LOADED':
            return {
                ...state,
                loaded: true,
                contracts: [...state.contracts, action.token]                
            }

        default:
            return state
    }
}

