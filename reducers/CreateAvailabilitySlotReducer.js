// import {
//     CREATE_SLOTS,SUCCESS_CREATE_SLOTS,FAILED_CREATE_SLOTS
// }
// from '../actions/CreateAvailabilitySlotsAction';
// const initialState = {
//     createSlotError:false,
//     createSlotData:[]
// }

// const CreateSlotsReducer=(state = [], action) =>{


//     switch (action.type) {

//         case CREATE_SLOTS:
//             return{
//                 ...state,
//           }

//         case SUCCESS_CREATE_SLOTS:
//             return {
//                 ...state,
//                 createSlotData:action.breakData,
//                 createSlotError:false,
//             }

//         case FAILED_CREATE_SLOTS:
//             return{
//                 ...state,
//                 createSlotError:true
//             }

//         default:
//             return state;
//     }
// }
// export default CreateSlotsReducer;