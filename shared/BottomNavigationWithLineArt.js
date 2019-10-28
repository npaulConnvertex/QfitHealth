import React from 'react';
import {Grid, Row} from "react-native-easy-grid";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";

export default function BottomNavigationWithLineArt(props) {
    const {SignUpRoute, navigation, bottomRowHeight} = props;
    const rowHeight = 50;
    const imageHeight = bottomRowHeight - rowHeight;
    return (<Grid>
            <Row>
                <Image style={{height: imageHeight, width: '100%'}}
                       source={require('./../assets/images/LineArt.png')}/>
            </Row>
            <Row style={{height: rowHeight}}>
                {SignUpRoute ? <TouchableOpacity style={styles.bottomRow} onPress={() => navigation.navigate('SignUp')}>
                        <Text style={{fontFamily: 'open-sans-hebrew', color: '#555555'}}>Not a member yet? </Text>
                        <View>
                            <Text style={{fontFamily: 'open-sans-hebrew-bold', color: '#287F7E'}}>Sign
                                up</Text>
                        </View>
                    </TouchableOpacity> :
                    <TouchableOpacity style={styles.bottomRow} onPress={() => navigation.navigate('SignIn')}>
                        <Text style={{fontFamily: 'open-sans-hebrew', color: 'rgba(0,0,0, 0.38)'}}>Already
                            Registered? </Text>
                        <View>
                            <Text style={{fontFamily: 'open-sans-hebrew-bold', color: '#287F7E'}}>Sign
                                in</Text>
                        </View>
                    </TouchableOpacity>}
            </Row>
        </Grid>
    );
}

const styles = StyleSheet.create({
    bottomRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopColor: '#CCCCCC',
        borderTopWidth: 1
    }
});
