import React from 'react';
import { Modal, StyleSheet, ActivityIndicator } from 'react-native';
import Lottie from 'lottie-react-native'
import { View } from 'native-base';

// let { Lottie } = DangerZone;


export default class LoadingAnimation extends React.Component {
    static defaultProps = {
        visible: false,
        overlayColor: 'rgba(0, 0, 0, 0.25)',
        animationType: 'none',
        animationStyle: {},
        source: 'https://assets5.lottiefiles.com/datafiles/67bae0ddb57b26679d10e9ce7c1d445f/data.json',
        speed: 1,
        loop: true,
    };
    state = {
        animation: null
    };



    componentWillMount() {
        // this._playAnimation();
    }

    componentDidMount() {
        // this._playAnimation();
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        // if (!nextProps.visible) {
        //     this._stopAnimation();
        // }
    }

    componentDidUpdate(prevProps) {
        const { visible } = this.props;
        console.log(visible, prevProps.visible);
    }

    _playAnimation = () => {
        if (!this.state.animation) {
            this._loadAnimationAsync();
        } else {
            this.animation.reset();
            this.animation.play();
        }
    };

    _stopAnimation = () => {
        this.setState({ animation: null });
    };

    _loadAnimationAsync = () => {
        let result = require('./../assets/images/data.json');
        this.setState({ animation: result }, this._playAnimation);
    };

    render() {
        const { visible, overlayColor, animationType } = this.props;

        return (
            <Modal visible={visible} transparent onRequestClose={() => {
            }}>
                {/* <Lottie
                    ref={animation => {
                        this.animation = animation;
                    }}
                    style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.25)',
                        position: 'absolute',
                    }}
                    source={require('./../assets/images/data.json')}
                /> */}
                <View style={{ width: "100%", height: "100%", backgroundColor: '#00000011', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#287F7E', borderRadius: 200 }}>
                        <ActivityIndicator
                            style={{ padding: 10 }}
                            size="large" color={"white"} />
                    </View>
                </View>


            </Modal>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    animationStyle: {
        height: '100%',
        width: '100%',
    },
});
