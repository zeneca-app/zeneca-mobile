import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';


const ErrorModal: React.FC<{
    visible: boolean,
    onClose: () => void,
    errorMessage: string,
}> = ({ visible, onClose, errorMessage }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
        >
            <Pressable
                style={styles.overlay}
                onPress={onClose}
            />
            <View style={styles.modalContent}>
                <Text style={styles.errorIcon}>🚫</Text>
                <Text style={styles.title}>Ha ocurrido un error</Text>
                <Text style={styles.message}>{errorMessage}</Text>
                <Pressable style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#19181B',
        borderRadius: 40,
        padding: 20,
        alignItems: 'center',
    },
    errorIcon: {
        fontSize: 40,
        color: 'red',
    },
    title: {
        fontSize: 24,
        color: 'white',
        marginVertical: 10,
    },
    message: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#252328',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default ErrorModal;