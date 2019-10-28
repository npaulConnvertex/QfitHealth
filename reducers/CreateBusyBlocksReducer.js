// import {
//     CREATE_BLOCKS,SUCCESS_CREATE_BLOCKS,FAILED_CREATE_BLOCKS
// }
// from '../actions/CreateBusyBlocksAction';
// const initialState = {
//     createBlockError:false,
//     createBlockData:[]
// }

// const CreateBlocksReducer=(state = [], action) =>{

//    switch (action.type) {

//         case CREATE_BLOCKS:
//             return{
//                 ...state,
//           }

//         case SUCCESS_CREATE_BLOCKS:
//             return {
//                 ...state,
//                 createBlockData:action.breakData,
//                 createBlockError:false
//             }

//         case FAILED_CREATE_BLOCKS:
//             return{
//                 ...state,
//                 createBlockError:true
//             }

//         default:
//             return state;
//     }
// }
// export default CreateBlocksReducer;