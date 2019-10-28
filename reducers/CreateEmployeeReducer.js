// import {
//     CREATE_EMPLOYEE,SUCCESS_CREATE_EMPLOYEE,FAILED_CREATE_EMPLOYEE
// } from "../actions/CreateEmployeeAction";

// const initialState = {
//     error:false,
// }

// const CreateEmployeeReducer=(state = initialState, action) =>{
//     switch (action.type) {
//         case CREATE_EMPLOYEE:
//             return{
//                 ...state,
//             }
//         case SUCCESS_CREATE_EMPLOYEE:
//             return{
//                 ...state,
//                 error:false,
//                 Empdata:action.data
//             }
//         case FAILED_CREATE_EMPLOYEE:
//             return{
//                 ...state,
//                 error:true,
//             }
//         default:
//             return state;
//     }
// }
// export default CreateEmployeeReducer;