import { StyleSheet, View } from 'react-native';
import { Host, Button as ComposeButton, TextButton, Icon, Row, Text } from '@expo/ui/jetpack-compose';
/*
* Host是 React Native 和 Expo UI 之间的桥梁。Android 上的 Jetpack Compose 组件和 iOS 上的 SwiftUI 组件仅在 `<div>` 元素内渲染Host。`size`
* 属性用于matchContents调整 `<div>` 元素的大小Host以适应其内容，此处为按钮。\
* 更多信息，请参阅HostJetpack Compose和SwiftUI 的相关文档。
* **/
type Props = {
    label: string;
    theme?: 'primary';
    onPress?: () => void;
};

export default function Button({ label, theme, onPress }: Props) {
    if (theme === 'primary') {
        return (
            <View style={styles.buttonContainer}>
                <Host matchContents>
                    <ComposeButton
                        onClick={onPress}
                        colors={{ containerColor: '#ffd33d', contentColor: '#25292e' }}>
                        <Row verticalAlignment="center" horizontalArrangement={{ spacedBy: 8 }}>
                            <Icon source={require('@expo/material-symbols/image.xml')} size={18} tint="#25292e" />
                            <Text color="#25292e">{label}</Text>
                        </Row>
                    </ComposeButton>
                </Host>
            </View>
        );
    }

    return (
        <View style={styles.buttonContainer}>
            <Host matchContents>
                <TextButton onClick={onPress} colors={{ contentColor: '#fff' }}>
                    <Text color="#fff">{label}</Text>
                </TextButton>
            </Host>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 320,
        height: 68,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
