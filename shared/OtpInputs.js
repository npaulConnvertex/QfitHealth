import React from 'react';
import {StyleSheet} from 'react-native';
import {Content, Input, Item} from 'native-base';
import {Col, Grid} from 'react-native-easy-grid';

class OtpInputs extends React.Component {

    state = {
        otpInputVal: Array(4).fill("")
    };
    otpTextInput = Array(4);

    componentDidMount() {
        this.otpTextInput[0]._root.focus();
    }

    onChangeHandler = (index, value) => {
        this.focusNext(index, value);
        this.setState(state => {
            const otpInputVal = state.otpInputVal.map((item, j) => {
                if (j === index) {
                    return value;
                } else {
                    return item;
                }
            });
            this.props.inputCallback(otpInputVal);
            return {
                otpInputVal,
            };
        });
    };

    renderInputs() {
        const inputs = Array(4).fill(0);
        const txt = inputs.map(
            (i, j) => <Col key={j} style={styles.txtMargin}><Item>
                <Input
                    style={[styles.inputRadius, styles.textInput]}
                    keyboardType="numeric"
                    onChangeText={v => this.onChangeHandler(j, v)}
                    onKeyPress={e => this.focusPrevious(e.nativeEvent.key, j)}
                    ref={ref => this.otpTextInput[j] = ref}
                    maxLength={1}
                />
            </Item></Col>
        );
        return txt;
    }

    focusPrevious(key, index) {
        if (key === 'Backspace' && index !== 0)
            this.otpTextInput[index - 1]._root.focus();
    }

    focusNext(index, value) {
        if (index < this.otpTextInput.length - 1 && value)
            this.otpTextInput[index + 1]._root.focus();
    }

    render() {
        return (
            <Content>
                <Grid style={styles.gridPad}>
                    {this.renderInputs()}
                </Grid>
            </Content>
        );
    }
}

const styles = StyleSheet.create({
    gridPad: {padding: 0},
    txtMargin: {margin: 3},
    inputRadius: {textAlign: 'center'},
    textInput: {
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: '#287F7E',
        fontFamily: 'open-sans-hebrew-bold',
        fontSize: 16
    }
});

export default OtpInputs;