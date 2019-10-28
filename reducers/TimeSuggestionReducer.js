// import {CREATE_TIME,SUCCESS_CREATE_TIME,FAILED_CREATE_TIME} from '../actions/TimeSuggestionAction';
// // import console = require('console');

// const initialState = {
//     createCError:false,
//     time_min:[],
// }

// const TimeSuggestionReducer=(state = initialState, action) =>{
//     switch (action.type) {
//         case CREATE_TIME:
//             return{
//                 ...state,
//             }
//         case SUCCESS_CREATE_TIME:
//             return {
//                 ...state,
//                 time_min:action.data,

//                 createCError:false,    
//             }
//         case FAILED_CREATE_TIME:
//             return{
//                 ...state,
//                 createCError:true
//             }
//         default:
//             return state;
//     }
// }
// export default TimeSuggestionReducer;