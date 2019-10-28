// import {
//     CREATE_SERVICE,SUCCESS_CREATE_SERVICE,FAILED_CREATE_SERVICE
// }
// from '../actions/CreateServiceAction';

// const initialState = {
//     createCError:false,
//     createCData:[]
// }

// const CreateServiceReducer=(state = [], action) =>{

//     switch (action.type) {

//         case CREATE_SERVICE:
//             return{
//                 ...state,
//           }

//         case SUCCESS_CREATE_SERVICE:
//             return {
//                 ...state,
//                 createCData:action.data,
//                 createCError:false,
//               }

//         case FAILED_CREATE_SERVICE:
//             return{
//                 ...state,
//                 createCError:true
//             }

//         default:
//             return state;
//     }
// }
// export default CreateServiceReducer;