import React from 'react'
import WebView from 'react-native-webview';


function SyntheticNewsDetail({ navigation, route }) {
    return (<WebView source={{ uri: route.params }} style={{ flex: 1 }} />)
}

export default SyntheticNewsDetail
