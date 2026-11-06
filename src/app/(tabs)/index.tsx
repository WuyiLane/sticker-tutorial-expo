import {View, StyleSheet, Platform} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import ImageViewer from '@/components/image-viewer'
import type {ImageSource} from 'expo-image'
import IconButton from "@/components/icon-button";
import CircleButton from "@/components/circle-button";
import Button from '@/components/button'
import {SafeAreaView} from "react-native-safe-area-context";
import {ComponentRef, useEffect, useRef, useState} from "react";
import EmojiPicker from "@/components/emoji-picker";
import EmojiList from '@/components/emoji-list';
import EmojiSticker from '@/components/emoji-sticker'
import {captureRef} from "react-native-view-shot";

const PlaceholderImage = require('@/assets/images/news-img/background-image.png')
export default function Index() {
    const imageRef = useRef<ComponentRef<typeof View>>(null);
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions({writeOnly: true})
    useEffect(() => {
        if (!permissionResponse?.granted) {

            requestPermission()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
    const [showAppOptions, setShowAppOptions] = useState<boolean>(false)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [pickedEmoji, setPickedEmoji] = useState<ImageSource | undefined>(undefined)
    const pickImageAsync = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1
        })
        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setShowAppOptions(true)
        } else {
            alert('You did not select any image.');
        }
    }
    const onReset = () => {

    }
    const onAddSticker = () => {
        setIsModalVisible(true)
    }
    const onModalClose = () => {
        setIsModalVisible(false)
    }
    const onSaveImageAsync = async () => {
        if (Platform.OS !== 'web') {
            try {
                const localUri = await captureRef(imageRef, {
                    height: 440,
                    quality: 1
                });
                await MediaLibrary.Asset.create(localUri);
                alert("Saved")
            } catch (e) {
                console.log(e);
            }
        } else {
            try {
                const dataUrl = await captureRef(imageRef, {
                    format: 'jpg',
                    quality: 0.95,
                    result: 'data-uri',
                });

                const link = document.createElement('a');
                link.download = 'sticker-smash.jpeg';
                link.href = dataUrl;
                link.click();
            } catch (e) {
                console.log(e);
            }
        }

    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.imageContainer}>
                <View ref={imageRef} collapsable={false}>
                    <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage}/>
                    {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji}/>}
                </View>
            </View>
            {
                showAppOptions ? (
                    <View style={styles.footerContainer}>
                        <View style={styles.optionsRow}>
                            <IconButton
                                icon={{
                                    android: require('@expo/material-symbols/refresh.xml'),
                                    ios: 'arrow.counterclockwise',
                                    web: 'refresh',
                                }}
                                label="Reset"
                                onPress={onReset}
                            />
                            <CircleButton onPress={onAddSticker}/>
                            <IconButton
                                icon={{
                                    android: require('@expo/material-symbols/download.xml'),
                                    ios: 'square.and.arrow.down',
                                    web: 'download',
                                }}
                                label="Save"
                                onPress={onSaveImageAsync}
                            />
                        </View>

                    </View>
                ) : (<View style={styles.footerContainer}>
                    <Button theme="primary" label="photo show me tell" onPress={pickImageAsync}/>
                    <Button label="Use this photo" onPress={() => setShowAppOptions(true)}/>
                </View>)
            }
            <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
                <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose}/>
            </EmojiPicker>

        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        alignItems: "center",
    },
    imageContainer: {
        flex: 1,
        paddingTop: Platform.select({web: 96, default: 20}),
    },
    button: {
        fontSize: 20,
        textDecorationLine: 'underline',
        color: '#fff',
    },
    footerContainer: {
        flex: 1 / 3,
        alignItems: 'center'
    },
    optionsRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
});
