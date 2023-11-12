import Constants from 'expo-constants';
import { Platform, StatusBar, StyleSheet, Text, View, Animated, Easing } from 'react-native';
import React, { Component } from 'react';
import NetInfo from '@react-native-community/netinfo';

const statusHeight = (Platform.OS === 'ios' ? Constants.statusBarHeight : 0);

export default class Status extends Component {
constructor(props) {
    super(props);
    this.state = {
    isConnected: false,
      spinValue: new Animated.Value(0), // Add a spin animation value
    };
}

componentDidMount() {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
    this.netInfoSubscription = NetInfo.addEventListener(this.handleConnectivityChange);
    }
}

componentWillUnmount() {
    if (this.netInfoSubscription) {
    this.netInfoSubscription();
    }
}

handleConnectivityChange = state => {
    this.setState({
    isConnected: state.isConnected,
    });

    // Start or stop the spin animation based on connectivity
    if (state.isConnected) {
    this.stopSpinAnimation();
    } else {
    this.startSpinAnimation();
    }
};

startSpinAnimation() {
    Animated.loop(
    Animated.timing(this.state.spinValue, {
        toValue: 1,
        duration: 1000, // Animation duration in milliseconds
        easing: Easing.linear,
        useNativeDriver: true,
    })
    ).start();
}

stopSpinAnimation() {
    this.state.spinValue.stopAnimation();
}

render() {
    const { isConnected, spinValue } = this.state;
    const backgroundColor = isConnected ? 'green' : 'red';
    const statusBar = (
    <StatusBar
        backgroundColor={backgroundColor}
        barStyle={isConnected ? 'dark-content' : 'light-content'}
        animated={false}
    />
    );

    // Define the spin animation style based on the spinValue
    const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
    });

    const messageContainer = (
    <View style={styles.messageContainer} pointerEvents="none">
        {statusBar}
        {!isConnected && (
        <Animated.View
            style={[styles.bubble, { transform: [{ rotate: spin }] }]}
        >
            <Text style={styles.text}>No network connection</Text>
        </Animated.View>
        )}
    </View>
    );

    if (Platform.OS === 'ios') {
    return <View style={[styles.status, { backgroundColor }]}></View>;
    }
    return messageContainer;
}
}

const styles = StyleSheet.create({
status: {
    zIndex: 1,
    height: statusHeight,
},
messageContainer: {
    zIndex: 1,
    position: 'absolute',
    top: statusHeight + 20,
    right: 0,
    left: 0,
    height: 80,
    alignItems: 'center',
},
bubble: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    paddingBottom: 10,
    backgroundColor: 'red',
},
text: {
    color: 'white',
},
});