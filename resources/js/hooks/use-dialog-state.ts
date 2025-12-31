import { useState } from 'react';

interface DialogState<T> {
    isOpen: boolean;
    selectedItem: T | null;
}

interface UseDialogStateReturn<T> {
    dialogStates: Record<string, DialogState<T>>;
    openDialog: (dialogName: string, item: T) => void;
    closeDialog: (dialogName: string) => void;
    closeAllDialogs: () => void;
    isDialogOpen: (dialogName: string) => boolean;
    getSelectedItem: (dialogName: string) => T | null;
}

export function useDialogState<T>(
    dialogNames: string[],
): UseDialogStateReturn<T> {
    const initialStates = dialogNames.reduce(
        (acc, name) => {
            acc[name] = { isOpen: false, selectedItem: null };
            return acc;
        },
        {} as Record<string, DialogState<T>>,
    );

    const [dialogStates, setDialogStates] =
        useState<Record<string, DialogState<T>>>(initialStates);

    const openDialog = (dialogName: string, item: T): void => {
        setDialogStates((prev) => ({
            ...prev,
            [dialogName]: {
                isOpen: true,
                selectedItem: item,
            },
        }));
    };

    const closeDialog = (dialogName: string): void => {
        setDialogStates((prev) => ({
            ...prev,
            [dialogName]: {
                isOpen: false,
                selectedItem: null,
            },
        }));
    };

    const closeAllDialogs = (): void => {
        setDialogStates((prev) => {
            const updated = { ...prev };
            Object.keys(updated).forEach((key) => {
                updated[key] = { isOpen: false, selectedItem: null };
            });
            return updated;
        });
    };

    const isDialogOpen = (dialogName: string): boolean => {
        return dialogStates[dialogName]?.isOpen ?? false;
    };

    const getSelectedItem = (dialogName: string): T | null => {
        return dialogStates[dialogName]?.selectedItem ?? null;
    };

    return {
        dialogStates,
        openDialog,
        closeDialog,
        closeAllDialogs,
        isDialogOpen,
        getSelectedItem,
    };
}
