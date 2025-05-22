import { View, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import styles from '../../assets/styles/signup.styles'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../constants/colors'
import { useState } from 'react'
import { useRouter } from 'expo-router'

export default function Signup() {

  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = () => {
    
  }
  return (
    <KeyboardAvoidingView 
      style={{flex:1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Ratón de biblioteca</Text>
          <Text style={styles.subtitle}>Comparte tus lecturas favoritas</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Alexis"
                placeholderTextColor={COLORS.placeholderText}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            </View>
          </View>   

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ingrese su correo"
                placeholderTextColor={COLORS.placeholderText}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            </View>
          </View> 

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="******"
                placeholderTextColor={COLORS.placeholderText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.primary} style={styles.eyeIcon} />
            </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Registrarse</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.link}>Iniciar Sesion</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>
  )
}