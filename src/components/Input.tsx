import type { InputChangeEventDetail, TextFieldTypes } from '@ionic/core';
import { IonItem, IonLabel, IonInput, IonText } from '@ionic/react';
import React from 'react';

export interface InputProps {
  value: string;
  label: string;
  error?: string;
  required?: boolean;
  onIonChange?: ((event: CustomEvent<InputChangeEventDetail>) => void) | undefined;
  type?: TextFieldTypes | undefined;
  onIonFocus?: ((event: CustomEvent<FocusEvent>) => void) | undefined;
  onIonBlur?: ((event: CustomEvent<FocusEvent>) => void) | undefined;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  error,
  type = 'text',
  required = false,
  onIonChange,
  onIonFocus,
  onIonBlur,
  placeholder,
}) => (
  <>
    <IonItem>
      <IonLabel position="stacked">
        {label}
        {required && <IonText color="danger"> *</IonText>}
      </IonLabel>
      <IonInput
        value={value}
        type={type}
        onIonChange={onIonChange}
        onIonFocus={onIonFocus}
        onIonBlur={onIonBlur}
        placeholder={placeholder}
      />
    </IonItem>
    {(error?.length ?? 0) > 0 && (
      <IonText color="danger" className="ion-padding-start">
        <small>{error}</small>
      </IonText>
    )}
  </>
);

export default Input;
