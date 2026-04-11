import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export type UpdateDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  onLater: () => void;
  onUpdateNow: () => void | Promise<void>;
  loading?: boolean;
};

/**
 * Soft-update modal: non-blocking overlay; parent keeps rendering the app underneath.
 */
export function UpdateDialog({
  visible,
  title,
  message,
  onLater,
  onUpdateNow,
  loading = false,
}: UpdateDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onLater}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onLater}
              style={({ pressed }) => [styles.buttonSecondary, pressed && styles.pressed]}
              disabled={loading}
            >
              <Text style={styles.buttonSecondaryLabel}>Later</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                void onUpdateNow();
              }}
              style={({ pressed }) => [styles.buttonPrimary, pressed && styles.pressed]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonPrimaryLabel}>Update now</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  title: {
    color: '#111',
  },
  message: {
    color: '#444',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  buttonSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    minWidth: 96,
    alignItems: 'center',
  },
  buttonSecondaryLabel: {
    color: '#222',
  },
  buttonPrimary: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimaryLabel: {
    color: '#fff',
  },
  pressed: {
    opacity: 0.85,
  },
});
