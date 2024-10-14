import { createNativeStackNavigator } from "@react-navigation/native-stack"
import MedControl from '../pages/MedControl/MedControl-index.js'
import Entrar from '../pages/Entrar/Entrar-index.js'
import Cadastro from '../pages/Cadastro/cadastro-index.js'
import UsuarioSecundario from '../pages/UsuarioSecundario/UsuarioSec-index.js'
import Perfil from '../pages/Perfil/perfil-index.js'
import Home from '../pages/Home/home-Index.js'
import MedAdd from '../pages/MedAdd/MedAdd-Index.js'
import Localizacao from '../pages/Localização/localMap-index.js'
import EditProfile from '../pages/EditProfile/EditProfile-index.js'

const Stack = createNativeStackNavigator();

export default function Routes() {
    return (
        <Stack.Navigator initialRouteName="Entrar">
            <Stack.Screen
                name="MedControl"
                component={MedControl}
                options={{ headerShown: false, animationEnabled: true }}
            />
            <Stack.Screen
                name="Entrar"
                component={Entrar}
                options={{ headerShown: false, animationEnabled: true }}
            />
            <Stack.Screen
                name="Cadastro"
                component={Cadastro}
                options={{ headerShown: false, animationEnabled: true }}
            />
            <Stack.Screen
                name="UsuarioSecundario"
                component={UsuarioSecundario}
                options={{ headerShown: false, animationEnabled: true }}
            />
            <Stack.Screen
                name="Perfil"
                component={Perfil}
                options={{ headerShown: false, animationEnabled: true}}
            />
            <Stack.Screen
                name='Home'
                component={Home}
                options={{ headerShown: false, animationEnabled: true}}
            />
            <Stack.Screen
                name='MedAdd'
                component={MedAdd}
                options={{ headerShown: false, animationEnabled: true}}
            />
            
            <Stack.Screen
                name='Localização'
                component={Localizacao}
                options={{ headerShown: false, animationEnabled: true}}
            />
            
            <Stack.Screen
                name='EditProfile'
                component={EditProfile}
                options={{ headerShown: false, animationEnabled: true}}
            />
        </Stack.Navigator>
    )
}