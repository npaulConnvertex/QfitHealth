import moment from "moment";

export default {
    employees: {
        "0053636b-828b-4d6e-bb64-52d4dbdf853f": {
            "nickname": "Asd",
            "settings": null,
            "color": "rgba(150, 0, 0, 0.26)",
            "selected": true,
            "isDone": true,
            "user": {
                "email": null,
                "first_name": null,
                "id": "0053636b-828b-4d6e-bb64-52d4dbdf853f",
                "image_id": null,
                "inserted_at": "2019-08-21T06:18:17",
                "last_name": null,
                "phone": "+91 77688 91475"
            }
        },
        "6bd5cec6-3217-4008-9d32-94439d6b3670": {
            "nickname": "S",
            "settings": null,
            "color": "rgba(150, 0, 0, 0.26)",
            "selected": false,
            "isDone": false,
            "user": {
                "email": null,
                "first_name": null,
                "id": "6bd5cec6-3217-4008-9d32-94439d6b3670",
                "image_id": null,
                "inserted_at": "2019-08-21T05:59:52",
                "last_name": null,
                "phone": "+91 8"
            }
        },
        "8ea0ff8d-3324-4d93-a481-52f8d3396147": {
            "nickname": "Sample emp 34",
            "settings": null,
            "color": "rgba(150, 0, 0, 0.26)",
            "selected": false,
            "isDone": false,
            "user": {
                "email": null,
                "first_name": null,
                "id": "8ea0ff8d-3324-4d93-a481-52f8d3396147",
                "image_id": null,
                "inserted_at": "2019-08-16T15:07:39",
                "last_name": null,
                "phone": "+91 99032 72255"
            }
        },
        "eeb02d65-71c1-4c61-8439-43b47be51c53": {
            "nickname": "rani",
            "settings": null,
            "color": "rgba(150, 0, 0, 0.26)",
            "selected": false,
            "isDone": false,
            "user": {
                "email": null,
                "first_name": null,
                "id": "eeb02d65-71c1-4c61-8439-43b47be51c53",
                "image_id": null,
                "inserted_at": "2019-07-17T15:53:08",
                "last_name": null,
                "phone": "+91 95119 70204"
            }
        },
        "fd01dd45-72cd-4db5-afc2-e503f118f3a3": {
            "nickname": "Sample Emp 2",
            "settings": null,
            "color": "rgba(150, 0, 0, 0.26)",
            "selected": false,
            "isDone": false,
            "user": {
                "email": null,
                "first_name": null,
                "id": "fd01dd45-72cd-4db5-afc2-e503f118f3a3",
                "image_id": null,
                "inserted_at": "2019-08-16T14:57:21",
                "last_name": null,
                "phone": "919909299292"
            }
        },
        "d991dd45-72cd-4db5-afc2-e503f778f301": {
            "nickname": "NoobMaster12",
            "settings": null,
            "color": "rgba(150, 0, 0, 0.26)",
            "selected": false,
            "isDone": false,
            "user": {
                "email": null,
                "first_name": null,
                "id": "d991dd45-72cd-4db5-afc2-e503f778f301",
                "image_id": null,
                "inserted_at": "2019-08-16T14:57:21",
                "last_name": null,
                "phone": "919909299292"
            }
        },
        "a451dd45-72cd-4db5-afc2-e503f778f301": {
            "nickname": "Surya Sen",
            "settings": null,
            "color": "rgba(150, 0, 0, 0.26)",
            "selected": false,
            "isDone": false,
            "user": {
                "email": null,
                "first_name": null,
                "id": "a451dd45-72cd-4db5-afc2-e503f778f301",
                "image_id": null,
                "inserted_at": "2019-08-16T14:57:21",
                "last_name": null,
                "phone": "919909299292"
            }
        }
    },
    slots: {
        "018403d8-9b8d-49e9-9f71-aa6ead260a50": [
            {
                key: 1,
                //startTime: moment().startOf('day').add(7, "hours").add(30, "minutes"),
                startTime: moment("2019-09-11T02:00:00.000Z"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#287F7E"
            }, {
                key: 2,
                //startTime: moment().startOf('day').add(7, "hours").add(30, "minutes"),
                startTime: moment("2019-09-11T02:00:00.000Z"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#EC696A"
            },
            {
                key: 3,
                //startTime: moment().startOf('day').add(9, "hours"),
                startTime: moment("2019-09-11T03:30:00.000Z"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            },
            {
                key: 4,
                //startTime: moment().startOf('day').add(9, "hours").add(30, "minutes"),
                startTime: moment("2019-09-11T04:00:00.000Z"),
                duration: 30,
                customer: "Krish Takahashi",
                serviceColor: "#EC696A"
            },
            {
                key: 5,
                //startTime: moment().startOf('day').add(11, "hours"),
                startTime: moment("2019-09-11T05:30:00.000Z"),
                duration: 60,
                customer: "Lunch Break",
                serviceColor: "#287F7E",
                type: "break"
            },
            {
                key: 6,
                //startTime: moment().startOf('day').add(15, "hours"),
                startTime: moment("2019-09-11T09:30:00.000Z"),
                duration: 15,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            },
            {
                key: 7,
                //startTime: moment().startOf('day').add(15, "hours").add(15, "minutes"),
                startTime: moment("2019-09-11T09:45:00.000Z"),
                duration: 15,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            },
            {
                key: 8,
                //startTime: moment().startOf('day').add(15, "hours").add(30, "minutes"),
                startTime: moment("2019-09-11T10:00:00.000Z"),
                duration: 15,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            },
            {
                key: 9,
                //startTime: moment().startOf('day').add(16, "hours"),
                startTime: moment("2019-09-11T10:30:00.000Z"),
                duration: 25,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            },
            {
                key: 10,
                //startTime: moment().startOf('day').add(16, "hours"),
                startTime: moment("2019-09-11T10:30:00.000Z"),
                duration: 50,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            },
        ],
        "1d87a860-bdcf-4752-b64f-692bc6a3a966": [
            {
                key: 1,
                //startTime: moment().startOf('day').add(7, "hours").add(30, "minutes"),
                startTime: moment("2019-09-11T02:00:00.000Z"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#287F7E"
            }, {
                key: 2,
                //startTime: moment().startOf('day').add(7, "hours").add(30, "minutes"),
                startTime: moment("2019-09-11T02:00:00.000Z"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#EC696A"
            },
            {
                key: 3,
                //startTime: moment().startOf('day').add(9, "hours"),
                startTime: moment("2019-09-11T03:30:00.000Z"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            },
            {
                key: 4,
                //startTime: moment().startOf('day').add(9, "hours").add(30, "minutes"),
                startTime: moment("2019-09-11T04:00:00.000Z"),
                duration: 30,
                customer: "Krish Takahashi",
                serviceColor: "#EC696A"
            },
            {
                key: 5,
                //startTime: moment().startOf('day').add(11, "hours"),
                startTime: moment("2019-09-11T05:30:00.000Z"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#287F7E"
            },
            {
                key: 6,
                //startTime: moment().startOf('day').add(15, "hours"),
                startTime: moment("2019-09-11T09:30:00.000Z"),
                duration: 15,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            },
            {
                key: 7,
                //startTime: moment().startOf('day').add(15, "hours").add(15, "minutes"),
                startTime: moment("2019-09-11T09:45:00.000Z"),
                duration: 15,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            },
            {
                key: 8,
                //startTime: moment().startOf('day').add(15, "hours").add(30, "minutes"),
                startTime: moment("2019-09-11T10:00:00.000Z"),
                duration: 15,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            },
            {
                key: 9,
                // startTime: moment().startOf('day').add(16, "hours"),
                startTime: moment("2019-09-11T10:30:00.000Z"),
                duration: 25,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            },
            {
                key: 10,
                //startTime: moment().startOf('day').add(16, "hours"),
                startTime: moment("2019-09-11T10:30:00.000Z"),
                duration: 50,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            },
        ],
        "35693b53-ff85-44eb-86b9-3722578cd2a5": [],
        "393abb4c-1825-4151-ae53-1ba308eee5f7": [],
        "83ebfd39-2869-4d69-9cc7-40bf479f5521": [],
        "8fc8ad6d-0722-40a7-a084-207320ea0352": [],
        "9d35667c-693e-4ffa-ac5e-3622a3150ba0": []
    },
    "3DaySlots": {
        [moment().startOf('day').format("YYYY-MM-DD")]: [
            {
                key: 1,
                startTime: moment().startOf('day').add(8, "hours").add(30, "minutes"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#287F7E"
            }, {
                key: 2,
                startTime: moment().startOf('day').add(8, "hours").add(30, "minutes"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#EC696A"
            },
            {
                key: 3,
                startTime: moment().startOf('day').add(11, "hours"),
                duration: 60,
                customer: "Lunch Break",
                serviceColor: "#287F7E",
                type: "break"
            },
            {
                key: 4,
                startTime: moment().startOf('day').add(15, "hours"),
                duration: 15,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            },
            {
                key: 6,
                startTime: moment().startOf('day').add(15, "hours").add(15, "minutes"),
                duration: 15,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            },
            {
                key: 7,
                startTime: moment().startOf('day').add(15, "hours").add(30, "minutes"),
                duration: 15,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            },
            {
                key: 8,
                startTime: moment().startOf('day').add(16, "hours").add(25, "minutes"),
                duration: 25,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            }
        ],
        [moment().startOf('day').add(1, "days").format("YYYY-MM-DD")]: [
            {
                key: 1,
                startTime: moment().startOf('day').add(1, "days").add(8, "hours").add(30, "minutes"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#287F7E"
            }, {
                key: 2,
                startTime: moment().startOf('day').add(1, "days").add(8, "hours").add(30, "minutes"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#EC696A"
            },
            {
                key: 3,
                startTime: moment().startOf('day').add(1, "days").add(11, "hours"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#287F7E"
            },
            {
                key: 4,
                startTime: moment().startOf('day').add(1, "days").add(15, "hours"),
                duration: 15,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            },
        ],
        [moment().startOf('day').add(2, "days").format("YYYY-MM-DD")]: [
            {
                key: 1,
                startTime: moment().startOf('day').add(2, "days").add(10, "hours").add(30, "minutes"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#287F7E"
            }
        ]
    },
    "5DaySlots": {
        [moment().startOf('day').format("YYYY-MM-DD")]: [
            {
                key: 1,
                startTime: moment().startOf('day').add(8, "hours").add(30, "minutes"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#287F7E"
            }, {
                key: 2,
                startTime: moment().startOf('day').add(8, "hours").add(30, "minutes"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#EC696A"
            },
            {
                key: 3,
                startTime: moment().startOf('day').add(11, "hours"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#287F7E"
            },
            {
                key: 4,
                startTime: moment().startOf('day').add(15, "hours"),
                duration: 15,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            },
            {
                key: 6,
                startTime: moment().startOf('day').add(15, "hours").add(15, "minutes"),
                duration: 15,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            },
            {
                key: 7,
                startTime: moment().startOf('day').add(15, "hours").add(30, "minutes"),
                duration: 15,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            },
            {
                key: 8,
                startTime: moment().startOf('day').add(16, "hours").add(25, "minutes"),
                duration: 25,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            },
        ],
        [moment().startOf('day').add(1, "days").format("YYYY-MM-DD")]: [
            {
                key: 1,
                startTime: moment().startOf('day').add(1, "days").add(8, "hours").add(30, "minutes"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#287F7E"
            }, {
                key: 2,
                startTime: moment().startOf('day').add(1, "days").add(8, "hours").add(30, "minutes"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#EC696A"
            },
            {
                key: 3,
                startTime: moment().startOf('day').add(1, "days").add(11, "hours"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#287F7E"
            },
            {
                key: 4,
                startTime: moment().startOf('day').add(1, "days").add(15, "hours"),
                duration: 15,
                customer: "Krish Takahashi",
                serviceColor: "#7364E6"
            },
        ],
        [moment().startOf('day').add(2, "days").format("YYYY-MM-DD")]: [
            {
                key: 1,
                startTime: moment().startOf('day').add(2, "days").add(10, "hours").add(30, "minutes"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#287F7E"
            }
        ],
        [moment().startOf('day').add(3, "days").format("YYYY-MM-DD")]: [
            {
                key: 1,
                startTime: moment().startOf('day').add(3, "days").add(9, "hours").add(30, "minutes"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#287F7E"
            }
        ],
        [moment().startOf('day').add(4, "days").format("YYYY-MM-DD")]: [
            {
                key: 1,
                startTime: moment().startOf('day').add(4, "days").add(11, "hours").add(30, "minutes"),
                duration: 60,
                customer: "Krish Takahashi",
                serviceColor: "#287F7E"
            }
        ],
    }
};