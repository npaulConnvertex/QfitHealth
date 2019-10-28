// import {DELETE_CUSTOMER_ID,SUCCESS_DELETE_CUSTOMER_ID,FAILED_DELETE_CUSTOMER_ID} from '../actions/DeleteCustomerAction';

// const initialState = {
//     deleteCError:false,
//     deleteCustData:[]
// }

// const DeleteCustomerReducer=(state = [], action) =>{
//     switch (action.type) {
//         case DELETE_CUSTOMER_ID:
//             return{
//                 ...state,
//             }
//         case SUCCESS_DELETE_CUSTOMER_ID:
//             return {
//                 ...state,
//                 deleteCustData:action.data,
//                 deleteCError:false,                
//             }
//         case FAILED_DELETE_CUSTOMER_ID:
//             return{
//                 ...state,
//                 deleteCError:true
//             }
//         default:
//             return state;
//     }
// }
// export default DeleteCustomerReducer;