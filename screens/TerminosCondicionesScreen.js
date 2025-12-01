import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// --- PALETA DE COLORES (Consistente con Home) ---
const COLORS = {
  headerBg: '#4CAF50',
  background: '#FFFFFF',
  textDark: '#263238',
  textMedium: '#546E7A',
  accent: '#FFC107',
};

// Componente para manejar títulos de sección y subtítulos
const SectionTitle = ({ children, level = 1, style = {} }) => {
  const baseStyle = level === 1 ? styles.sectionTitle : styles.heading2;
  return <Text style={[baseStyle, style]}>{children}</Text>;
};

export default function TerminosCondicionesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.headerBg} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Términos y Condiciones</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.documentTitle}>TÉRMINOS Y CONDICIONES</Text>
        <Text style={styles.lastUpdate}>Última actualización: 30 de noviembre de 2025</Text>

        {/* 1. ACUERDO DE TÉRMINOS LEGALES */}
        <SectionTitle>1. ACUERDO DE TÉRMINOS LEGALES</SectionTitle>
        <Text style={styles.paragraph}>
          Somos <Text style={styles.boldText}>FitaCompany</Text> (la "Compañía", "nosotros", "nuestro"), una compañía registrada en <Text style={styles.boldText}>Chile</Text>, con domicilio en <Text style={styles.boldText}>freire, rancagua, sexta región</Text>. Operamos la aplicación móvil <Text style={styles.boldText}>Fita</Text> (la "App"), así como cualquier otro producto o servicio relacionado que se refiera o enlace a estos términos legales (los "Términos Legales") (colectivamente, los "Servicios").
        </Text>
        <Text style={styles.paragraph}>
          Puede contactarnos por teléfono al <Text style={styles.boldText}>+5699977847588</Text>, por correo electrónico a <Text style={styles.linkText}>FitaCompany@hotmail.com</Text> o por correo a freire, rancagua, sexta región, Chile.
        </Text>
        <Text style={styles.paragraph}>
          Estos Términos Legales constituyen un acuerdo legalmente vinculante entre usted, ya sea personalmente o en nombre de una entidad ("usted"), y FitaCompany, en relación con su acceso y uso de los Servicios. Al acceder a los Servicios, usted ha leído, entendido y acepta estar obligado por todos estos Términos Legales.
        </Text>
        
        {/* 2. NUESTROS SERVICIOS */}
        <SectionTitle>2. NUESTROS SERVICIOS</SectionTitle>
        <Text style={styles.paragraph}>
          La información proporcionada al utilizar los Servicios no está destinada a ser distribuida ni utilizada por ninguna persona o entidad en ninguna jurisdicción o país donde dicha distribución o uso sea contrario a la ley o regulación.
        </Text>
        
        {/* 3. DERECHOS DE PROPIEDAD INTELECTUAL */}
        <SectionTitle>3. DERECHOS DE PROPIEDAD INTELECTUAL</SectionTitle>
        <SectionTitle level={2}>Nuestra propiedad intelectual</SectionTitle>
        <Text style={styles.paragraph}>
          Somos propietarios o licenciatarios de todos los derechos de propiedad intelectual de nuestros Servicios, incluyendo todo el código fuente, bases de datos, funcionalidad, software, diseños, audio, video, texto, fotografías y gráficos (colectivamente, el "Contenido"), así como las marcas comerciales y logotipos (las "Marcas").
        </Text>
        <SectionTitle level={2}>Su uso de nuestros Servicios</SectionTitle>
        <Text style={styles.paragraph}>
          Sujeto a su cumplimiento de estos Términos Legales, le otorgamos una licencia no exclusiva, intransferible y revocable para acceder y utilizar los Servicios únicamente para su uso personal y no comercial. Excepto lo dispuesto en esta sección, ninguna parte de los Servicios, Contenido o Marcas podrá ser copiada, reproducida, agregada, republicada, cargada o explotada para ningún propósito comercial.
        </Text>

        {/* 4. DECLARACIONES DEL USUARIO */}
        <SectionTitle>4. DECLARACIONES DEL USUARIO</SectionTitle>
        <Text style={styles.paragraph}>
          Al utilizar los Servicios, usted declara y garantiza que: (1) toda la información de registro que envíe es veraz, precisa y completa; (2) tiene capacidad legal para cumplir con estos Términos; (3) no es menor de edad en su jurisdicción o cuenta con el permiso de sus padres/tutores; y (4) no utilizará los Servicios con fines ilegales o no autorizados.
        </Text>
        
        {/* 5. REGISTRO DE USUARIO */}
        <SectionTitle>5. REGISTRO DE USUARIO</SectionTitle>
        <Text style={styles.paragraph}>
          Es posible que se le solicite registrarse para utilizar los Servicios. Usted se compromete a mantener la confidencialidad de su contraseña y será responsable de todo uso de su cuenta y contraseña.
        </Text>

        {/* 6. COMPRAS Y PAGO */}
        <SectionTitle>6. COMPRAS Y PAGO</SectionTitle>
        <Text style={styles.paragraph}>
          Aceptamos formas de pago como <Text style={styles.boldText}>Visa</Text>. Usted acepta proporcionar información de compra y de cuenta precisa. Todos los pagos se realizarán en <Text style={styles.boldText}>pesos chilenos</Text> (CLP).
        </Text>

        {/* 7. SUSCRIPCIONES */}
        <SectionTitle>7. SUSCRIPCIONES</SectionTitle>
        <SectionTitle level={2}>Facturación y Renovación</SectionTitle>
        <Text style={styles.paragraph}>
          Su suscripción continuará y se renovará automáticamente a menos que se cancele. Usted acepta que carguemos su método de pago de forma recurrente sin requerir su aprobación previa para cada cargo, hasta que cancele la orden aplicable.
        </Text>
        <SectionTitle level={2}>Cancelación</SectionTitle>
        <Text style={styles.paragraph}>
          Puede cancelar su suscripción en cualquier momento iniciando sesión en su cuenta. Su cancelación entrará en vigencia al final del plazo pagado actual.
        </Text>
        
        {/* 8. POLÍTICA DE REEMBOLSO */}
        <SectionTitle>8. POLÍTICA DE REEMBOLSO</SectionTitle>
        <Text style={styles.paragraph}>
          <Text style={styles.boldText}>Todas las ventas son finales y no se emitirá ningún reembolso.</Text>
        </Text>

        {/* 9. ACTIVIDADES PROHIBIDAS */}
        <SectionTitle>9. ACTIVIDADES PROHIBIDAS</SectionTitle>
        <Text style={styles.paragraph}>
          No podrá acceder o utilizar los Servicios para ningún propósito distinto al que los ponemos a disposición. Se prohíben, entre otras cosas, la recuperación sistemática de datos, el fraude, la interferencia con las funciones de seguridad, el uso para acosar o abusar de otras personas, la carga o transmisión de virus y el uso no autorizado de los Servicios para competir con nosotros.
        </Text>

        {/* 10. CONTRIBUCIONES GENERADAS POR EL USUARIO */}
        <SectionTitle>10. CONTRIBUCIONES GENERADAS POR EL USUARIO</SectionTitle>
        <Text style={styles.paragraph}>
          Al publicar Contribuciones (texto, fotos, etc.) en cualquier parte de los Servicios, usted nos otorga una licencia ilimitada, irrevocable, mundial y totalmente pagada para usar, copiar, reproducir, distribuir, publicar y explotar dichas Contribuciones con cualquier fin. Usted es el único responsable de lo que publique o cargue.
        </Text>

        {/* 11. LICENCIA DE APLICACIÓN MÓVIL */}
        <SectionTitle>11. LICENCIA DE APLICACIÓN MÓVIL</SectionTitle>
        <Text style={styles.paragraph}>
          Le otorgamos el derecho limitado a instalar y usar la App en dispositivos electrónicos inalámbricos de su propiedad. No debe descompilar, aplicar ingeniería inversa, modificar o crear obras derivadas de la App, ni utilizarla para un propósito para el que no está diseñada.
        </Text>
        
        {/* 12. SITIOS WEB Y CONTENIDO DE TERCEROS */}
        <SectionTitle>12. SITIOS WEB Y CONTENIDO DE TERCEROS</SectionTitle>
        <Text style={styles.paragraph}>
          Los Servicios pueden contener enlaces a sitios web de terceros. No investigamos, monitoreamos ni verificamos la precisión o integridad de estos sitios y no somos responsables de ellos ni del contenido de terceros. Su acceso a estos es bajo su propio riesgo.
        </Text>
        
        {/* 13. ANUNCIANTES */}
        <SectionTitle>13. ANUNCIANTES</SectionTitle>
        <Text style={styles.paragraph}>
          Permitimos a los anunciantes mostrar sus anuncios en ciertas áreas de los Servicios. Simplemente proporcionamos el espacio y no tenemos otra relación con los anunciantes.
        </Text>

        {/* 14. GESTIÓN DE SERVICIOS */}
        <SectionTitle>14. GESTIÓN DE SERVICIOS</SectionTitle>
        <Text style={styles.paragraph}>
          Nos reservamos el derecho de monitorear los Servicios en busca de violaciones, tomar medidas legales, negar el acceso a cualquier persona y gestionar los Servicios para proteger nuestros derechos y propiedad.
        </Text>

        {/* 15. POLÍTICA DE PRIVACIDAD */}
        <SectionTitle>15. POLÍTICA DE PRIVACIDAD</SectionTitle>
        <Text style={styles.paragraph}>
          Nos preocupamos por la privacidad y la seguridad de los datos. Al utilizar los Servicios, acepta estar sujeto a nuestra Política de Privacidad. Si accede desde fuera de Chile, consiente expresamente que sus datos sean transferidos y procesados en Chile.
        </Text>
        
        {/* 16. PLAZO Y TERMINACIÓN */}
        <SectionTitle>16. PLAZO Y TERMINACIÓN</SectionTitle>
        <Text style={styles.paragraph}>
          Estos Términos Legales permanecerán en pleno vigor mientras utilice los Servicios. Sin limitar otras disposiciones, nos reservamos el derecho de negar el acceso a los Servicios a cualquier persona, sin previo aviso ni responsabilidad, por cualquier motivo o por incumplimiento de estos Términos Legales.
        </Text>
        
        {/* 17. MODIFICACIONES E INTERRUPCIONES */}
        <SectionTitle>17. MODIFICACIONES E INTERRUPCIONES</SectionTitle>
        <Text style={styles.paragraph}>
          Nos reservamos el derecho de cambiar, modificar o eliminar el contenido de los Servicios en cualquier momento. No garantizamos que los Servicios estarán disponibles en todo momento y no seremos responsables por pérdidas, daños o inconvenientes causados por interrupciones o descontinuación de los Servicios.
        </Text>

        {/* 18. LEY APLICABLE */}
        <SectionTitle>18. LEY APLICABLE</SectionTitle>
        <Text style={styles.paragraph}>
          Estos Términos Legales se regirán e interpretarán de acuerdo con las leyes de <Text style={styles.boldText}>Chile</Text>. FitaCompany y usted consienten irrevocablemente que los tribunales de <Text style={styles.boldText}>Chile</Text> tengan jurisdicción exclusiva para resolver cualquier disputa.
        </Text>

        {/* 19. RESOLUCIÓN DE DISPUTAS */}
        <SectionTitle>19. RESOLUCIÓN DE DISPUTAS</SectionTitle>
        <Text style={styles.paragraph}>
          Cualquier disputa que surja en relación con estos Términos Legales se resolverá en los tribunales competentes de Chile. Las partes acuerdan que cualquier arbitraje se limitará a la disputa entre las partes individualmente.
        </Text>
        
        {/* 20. CORRECCIONES */}
        <SectionTitle>20. CORRECCIONES</SectionTitle>
        <Text style={styles.paragraph}>
          Nos reservamos el derecho de corregir errores, inexactitudes u omisiones en la información de los Servicios en cualquier momento sin previo aviso.
        </Text>
        
        {/* 21. DESCARGO DE RESPONSABILIDAD (DISCLAIMER) */}
        <SectionTitle>21. DESCARGO DE RESPONSABILIDAD</SectionTitle>
        <Text style={styles.paragraph}>
          LOS SERVICIOS SE PROPORCIONAN "TAL CUAL" Y "SEGÚN DISPONIBILIDAD". USTED ACEPTA QUE EL USO DE LOS SERVICIOS ES BAJO SU PROPIO RIESGO. RECHAZAMOS TODAS LAS GARANTÍAS, EXPRESAS O IMPLÍCITAS, INCLUIDAS LAS GARANTÍAS DE COMERCIABILIDAD Y ADECUACIÓN PARA UN PROPÓSITO PARTICULAR.
        </Text>
        
        {/* 22. LIMITACIÓN DE RESPONSABILIDAD */}
        <SectionTitle>22. LIMITACIÓN DE RESPONSABILIDAD</SectionTitle>
        <Text style={styles.paragraph}>
          EN NINGÚN CASO NOSOTROS O NUESTROS DIRECTORES, EMPLEADOS O AGENTES SEREMOS RESPONSABLES ANTE USTED O CUALQUIER TERCERO POR DAÑOS DIRECTOS, INDIRECTOS, INCIDENTALES, ESPECIALES O PUNITIVOS. Nuestra responsabilidad total ante usted, por cualquier causa y forma de acción, se limitará a la cantidad pagada por usted, si la hubiere, en los últimos doce (12) meses.
        </Text>
        
        {/* 23. INDEMNIZACIÓN */}
        <SectionTitle>23. INDEMNIZACIÓN</SectionTitle>
        <Text style={styles.paragraph}>
          Usted acepta defendernos, indemnizarnos y eximirnos de responsabilidad a nosotros y a nuestros afiliados por cualquier pérdida, daño, responsabilidad, reclamo o demanda de terceros debido o derivado de su uso de los Servicios o el incumplimiento de estos Términos Legales.
        </Text>
        
        {/* 24. DATOS DEL USUARIO */}
        <SectionTitle>24. DATOS DEL USUARIO</SectionTitle>
        <Text style={styles.paragraph}>
          Mantenemos ciertos datos que usted transmite para gestionar el rendimiento de los Servicios. Usted es el único responsable de todos los datos que transmita.
        </Text>

        {/* 25. COMUNICACIONES ELECTRÓNICAS */}
        <SectionTitle>25. COMUNICACIONES ELECTRÓNICAS</SectionTitle>
        <Text style={styles.paragraph}>
          Usted da su consentimiento para recibir comunicaciones electrónicas y acepta que todos los acuerdos, avisos y divulgaciones que le proporcionamos electrónicamente cumplen con cualquier requisito legal de que dichas comunicaciones sean por escrito.
        </Text>

        {/* 26. VARIOS */}
        <SectionTitle>26. VARIOS</SectionTitle>
        <Text style={styles.paragraph}>
          Estos Términos Legales y las políticas publicadas constituyen el acuerdo completo entre usted y nosotros. Nuestra incapacidad para ejercer cualquier derecho no operará como una renuncia a dicho derecho.
        </Text>
        
        {/* 27. CONTÁCTENOS */}
        <SectionTitle>27. CONTÁCTENOS</SectionTitle>
        <Text style={styles.paragraph}>
          Para resolver una queja o recibir más información sobre el uso de los Servicios, contáctenos en:
          {"\n\n"}<Text style={styles.boldText}>FitaCompany</Text>
          {"\n"}freire, rancagua, sexta región, Chile
          {"\n"}Teléfono: +5699977847588
          {"\n"}Correo: <Text style={styles.linkText}>fitacompany@hotmail.com</Text>
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>FITA App - Chile 🇨🇱</Text>
        </View>
        
        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.headerBg,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4
  },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 20, color: '#FFF', fontWeight: 'bold' },
  
  content: { padding: 25 },
  documentTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 5, textAlign: 'center' },
  lastUpdate: { fontSize: 14, color: COLORS.textMedium, marginBottom: 30, fontStyle: 'italic', textAlign: 'center' },
  
  sectionTitle: { fontSize: 19, fontWeight: 'bold', color: COLORS.textDark, marginTop: 25, marginBottom: 10 },
  heading2: { fontSize: 17, fontWeight: 'bold', color: COLORS.textDark, marginTop: 15, marginBottom: 8, marginLeft: 10 },
  
  paragraph: { 
    fontSize: 14, 
    color: COLORS.textMedium, 
    lineHeight: 22, 
    textAlign: 'justify', 
    marginBottom: 15,
  },
  boldText: { fontWeight: 'bold', color: COLORS.textDark },
  linkText: { color: COLORS.headerBg, textDecorationLine: 'underline' },
  
  footer: { marginTop: 40, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#EEEEEE', paddingTop: 20 },
  footerText: { color: '#B0BEC5', fontWeight: 'bold' }
});