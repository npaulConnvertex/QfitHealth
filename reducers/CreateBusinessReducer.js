// import {CREATE_BUSINESS,SUCCESS_CREATE_BUSINESS,FAILED_CREATE_BUSINESS} from '../actions/CreateBusinessAction';

// const initialState = {
//     createBError:false,
//     createBData:[]
// }

// const CreateBusinessReducer=(state = [], action) =>{
//     switch (action.type) {
//         case CREATE_BUSINESS:
//             return{
//                 ...state,
//             }
//         case SUCCESS_CREATE_BUSINESS:
//             return {
//                 ...state,
//                 createBData:action.data,
//                 createBError:false,                
//             }
//         case FAILED_CREATE_BUSINESS:
//             return{
//                 ...state,
//                 createBError:true
//             }
//         default:
//             return state;
//     }
// }
// export default CreateBusinessReducer;