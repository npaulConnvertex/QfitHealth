import React from "react";
import {FlatList, Text, View,Image,ScrollView,} from "react-native";
import {Body, Left, ListItem, Right,Button} from "native-base";
// import console = require("console");
// import {Button as EleButton} from 'react-native-elements';

export default class Upcoming extends React.Component {
    constructor() {
        super();
        this.state = {

            data: [
                {time: "TODAY", header: true},
                { services:[{name:'Men Haircut', color:'#7986CB'}], customer:[{ name:'Tomer BarKar'}], employees: [{name:"Ronit Cohen" }], time:'1:00', header: false},
                { services:[{name:'Women Haircut', color:'#33B679'}], customer:[{ name:'Yonit Bar Lev '}], employees: [{name:"Ronit Cohen"}], time:"13:30", header: false},
                { services:[{name:'Women Haircut', color:'#33B679'}], customer:[{ name:'Yuu Bulb'}], employees: [{name:" Miyuki Shimose "}], time:"15:10", header: false},               
                { time: "TOMORROW", header: true},
                { services:[{name:'Men Haircut + Beard ', color:'#F4511E'}], customer:[{ name:'Jack Daniel'}], employees: [{name:"Ronit Cohen"}], time:"13:10", header: false},
                { services:[{name:'Women Haircut', color:'#33B679'}], customer:[{ name:'Yonit Bar Lev '}], employees: [{name:"Ronit Cohen"}], time:"15:20", header: false},               
                { time: "14/04/2019 (IN 3 DAYS)", header: true},
                { services:[{name:'Men Haircut + Beard ', color:'#F4511E'}], customer:[{ name:'Black Door'}], employees: [{name:"Ronit Cohen"}], time:"13:20", header: false},
                            ],
            stickyHeaderIndices: []
        };
    }

    componentWillMount() {
        var arr = [];
        this.state.data.map(obj => {
            if (obj.header) {
                arr.push(this.state.data.indexOf(obj));
            }
        });
        arr.push(0);
        this.setState(prevState => {
            return {
                ...prevState,
                stickyHeaderIndices: arr
            }
        });
    }

    getEmployeesNames = (employees) => {
        let output = "";
        if (employees.length > 2) {
            output += employees[0].name + ", ";
            output += employees[1].name + " and ";
            output += `${employees.length - 2} more`;
        }
        if (employees.length === 2) {
            output += employees[0].name + ", ";
            output += employees[1].name;
        }
        if (employees.length === 1) {
            output += employees[0].name;
        }
        return output;
    };

    renderItem = ({item}) => {
        if (item.header) {
            return (
                <ListItem itemDivider
                          style={{
                              backgroundColor: '#fff',
                              height: 45,
                              width:"100%",
                              top:10,
                              fontFamily:'open-sans-hebrew-bold',
                              elevation:0
                          }}>
                   
                          <Text style={{fontFamily: 'open-sans-hebrew-bold',letterSpacing:1, fontSize: 12, color: '#888888'}}>
                              {item.time}
                          </Text>
                    
                </ListItem>
            );
        } else if (!item.header) {
            let services=[...item.services];
            console.log("the value" ,services[0].color)
            let employees = [...item.employees];
            let customer=[...item.customer];
            console.log("test",item);
            return (
                <ScrollView>
                <View style={{marginBottom:10}}>
                <ListItem style={{marginLeft: 10, borderBottomWidth: 0,}}>
                    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Image  source={require('./../assets/images/Person.png')}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 40 / 2,
                        }}
                        resizeMode={"cover"}/>
                            
                            
                    </View>
                  
                     <View style={{flex: 5, justifyContent: 'center', alignItems: 'flex-start',top:15}}>
                                <View style={{flex:0, flexDirection:'row' ,justifyContent:'flex-start',}}>
                                    <Button style={{backgroundColor:services[0].color, width:14,height:14,borderRadius:14/3}}/>
                                                                                                
                                    <Text style={{fontFamily: 'open-sans-hebrew',fontSize: 14,color: '#888888',marginLeft:5 
                                    }}><Text style={{fontFamily:'open-sans-hebrew-bold' ,fontSize:14 ,color: 'black'}}>{services[0].name}</Text> at 13:00</Text>
                                </View>
                                <View style={{marginLeft:-8,padding:5}}>
                                        <Text style={{fontFamily: 'open-sans-hebrew',fontSize: 14,color: '#888888'
                                    }}><Text style={{fontFamily:'open-sans-hebrew-bold' ,fontSize:14 ,color: '#888888'}}>{employees[0].name}</Text> with {customer[0].name}</Text>
                             </View>
                    </View>
                   
                </ListItem>
                </View> 
                </ScrollView>
            );
        }
    };

    render() {
        return (
            <FlatList
                data={this.state.data}
                renderItem={this.renderItem}    
                keyExtractor={item => item.time}
                stickyHeaderIndices={this.state.stickyHeaderIndices}
            />
        );
    }
}
