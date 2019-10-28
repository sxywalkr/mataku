import React, { useState }  from 'react';
import { Image, SafeAreaView, StyleSheet, View, ViewStyle, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
    Avatar,
    Paragraph,
    FAB,
    Headline,
    Divider,
    Subheading,
    Theme,
    Title,
    withTheme,
    Button,
} from 'react-native-paper';
import ImageView from 'react-native-image-view';

interface Props {
    //   children?: React.ReactNode | React.ReactNode[];
    //   height: number;
    //   colors: string[];
    //   image?: string;
    //   style?: ViewStyle;
}

const images1 = [
    {
        source: {
            uri: 'https://firebasestorage.googleapis.com/v0/b/fbmataku.appspot.com/o/apps_assets%2Fgb1.png?alt=media&token=686e4e55-8c1d-475e-a1e2-3f1919f2aa9b',
        },
        title: 'Gambar 1',
        // width: 806,
        // height: 720,
    },
];
const images2 = [
    {
        source: {
            uri: 'https://firebasestorage.googleapis.com/v0/b/fbmataku.appspot.com/o/apps_assets%2Fgb2.png?alt=media&token=e88dde26-46ac-447a-b4f2-6a4385664207',
        },
        title: 'Gambar 2',
        // width: 806,
        // height: 720,
    },
    {
        source: {
            uri: 'https://firebasestorage.googleapis.com/v0/b/fbmataku.appspot.com/o/apps_assets%2Fgb3.png?alt=media&token=af80230f-6682-4ee4-83a4-e7a62f4271ef',
        },
        title: 'Gambar 3',
        // width: 806,
        // height: 720,
    },
];

function Howto() {
    const [viewImages1, setViewImages1] = useState(false)
    const [viewImages2, setViewImages2] = useState(false)
    
    return (
        <ScrollView style={styles.content}>
            <Title>Deteksi Dini Katarak (Metode Hitung Jari)</Title>
            <Paragraph>1. Pemeriksa berdiri enam (6) meter di depan klien di ruang terbuka, yang mempunyai pencahayaan yang terang.</Paragraph>
            <Paragraph>2. Pemeriksaan dimulai dengan mata kanan, mata kiri ditutup dengan menggunakan penutup mata atau dengan telapak tangan kiri tanpa penekanan.</Paragraph>
            <Button mode="outlined" style={styles.button} onPress={() => setViewImages1(true)}>Lihat Gambar</Button>
            {/* <ImageView
                // style={styles.icon}
                source={{
                    uri:
                        'https://firebasestorage.googleapis.com/v0/b/fbmataku.appspot.com/o/apps_assets%2Fgb1.png?alt=media&token=686e4e55-8c1d-475e-a1e2-3f1919f2aa9b',
                }}
            /> */}
            <ImageView
                images={images1}
                imageIndex={0}
                isVisible={viewImages1}
                onClose={() => setViewImages1(false)}
            />
            <Paragraph>3. Pemeriksa mengacungkan jari setinggi posisi mata klien atau di depan dada, untuk menghitung/menunjukkan arah jari pemeriksa.</Paragraph>
            <Button mode="outlined" style={styles.button} onPress={() => setViewImages2(true)}>Lihat Gambar</Button>
            <ImageView
                images={images2}
                imageIndex={0}
                isVisible={viewImages2}
                onClose={() => setViewImages2(false)}
            />
            {/* <ImageView
                images={images3}
                imageIndex={0}
                isVisible={viewImages3}
            /> */}
            <Paragraph>4. Jika klien salah menghitung/menunjukkan arah jari pemeriksa minimal 2 kali atau lebih dari 5 kali pemeriksaan/acungan berarti klien mengalami gangguan penglihatan.</Paragraph>
            <Paragraph>5. Lakukan langkah-langkah nomor 1 s.d nomor 4 untuk mata sebelah kirinya</Paragraph>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    absolute: {
        flex: 1,
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#fff',
    },
    content: {
        paddingHorizontal: 20,
    },
    icon: {
        alignSelf: 'center',
        padding: 10,
        width: 120,
        height: 120,
    },
    button: {
        alignSelf: 'center',
        marginVertical: 20,
      },
});

export default Howto;
