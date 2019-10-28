// import {
//     SET_OPENING_HOURS, SUCCESS_SET_OPENING_HOURS, FAILED_SET_OPENING_HOURS
// }
//     from '../actions/SetOpeningHoursAction';

// const initialState = {
//     createCError: false,
//     openingHours: []
// }

// const SetOpeningHoursReducer = (state = [], action) => {

//     switch (action.type) {
//         case SET_OPENING_HOURS:
//             return {
//                 ...state,
//             }

//         case SUCCESS_SET_OPENING_HOURS:
//             console.log("reducer", action)
//             return {
//                 ...state,
//                 openingHours: action.data,
//                 createCError: false,
//             }

//         case FAILED_SET_OPENING_HOURS:
//             return {
//                 ...state,
//                 createCError: true
//             }

//         default:
//             return state;
//     }
// }
// export default SetOpeningHoursReducer;