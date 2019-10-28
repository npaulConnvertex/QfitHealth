// export const CREATE_APPOINTMENT = "CREATE_APPOINTMENT";
// import {CREATE_APPOINTMENT,SUCCESS_CREATE_APPOINTMENT,FAILED_CREATE_APPOINTMENT} from '../actions/CreateAppointment';

// const initialState = {
//     createCError:false,
//     createCData:[]
// }

// const CreateAppointmentReducer=(state = [], action) =>{
//     switch (action.type) {
//         case CREATE_APPOINTMENT:
//             return{
//                 ...state,
//             }
//         case SUCCESS_CREATE_APPOINTMENT:
//             return {
//                 ...state,
//                 createCData:action.data,
//                 createCError:false,    
//             }
//         case FAILED_CREATE_APPOINTMENT:
//             return{
//                 ...state,
//                 createCError:true
//             }
//         default:
//             return state;
//     }
// }
// export default CreateAppointmentReducer;