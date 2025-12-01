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
  headerBg: '#4CAF50', // Verde Principal
  background: '#F2F5ED', // Fondo Crema/Menta
  cardBg: '#FFFFFF', // Fondo de Tarjetas Blanco
  textDark: '#263238',
  textMedium: '#546E7A',
  accent: '#FFC107', // Amarillo Ámbar
  shadowColor: '#263238',
};

// Iconos asociados a la sección legal
const SECTION_ICONS = {
    1: "handshake-outline", // Acuerdo
    2: "devices",         // Servicios
    3: "copyright",       // Propiedad Intelectual
    4: "account-check-outline", // Declaraciones
    5: "account-plus-outline", // Registro
    6: "credit-card-outline", // Pagos
    7: "crown-outline",     // Suscripciones
    8: "receipt-text-check-outline", // Reembolso/Política
    9: "alert-octagon-outline", // Prohibidas
    10: "comment-text-multiple-outline", // Contribuciones
    11: "cellphone",       // Licencia App
    12: "web",             // Terceros
    13: "badge-account-horizontal-outline", // Anunciantes
    14: "cogs",            // Gestión
    15: "shield-lock-outline", // Privacidad
    16: "gavel",           // Plazo y Terminación
    17: "update",          // Modificaciones
    18: "scale-balance",   // Ley Aplicable
    19: "forum-outline",   // Disputas
    20: "pencil-box-outline",// Correcciones
    21: "exclamation-thick",// Descargo
    22: "account-cancel-outline",// Limitación de Responsabilidad
    23: "cash-lock-open",  // Indemnización
    24: "database-marker-outline", // Datos de Usuario
    25: "email-check-outline", // Comunicaciones Electrónicas
    26: "dots-horizontal-circle-outline", // Varios
    27: "phone-message-outline", // Contáctenos
};

// Componente para manejar títulos de sección (con icono y estilo de tarjeta)
const SectionHeader = ({ index, title }) => (
    <View style={styles.sectionHeaderContainer}>
        <View style={styles.sectionIconCircle}>
            <Icon name={SECTION_ICONS[index] || "information-outline"} size={20} color={COLORS.cardBg} />
        </View>
        <Text style={styles.sectionTitleText}>
            {index}. {title}
        </Text>
    </View>
);

// Contenido legal formateado como array de objetos
const legalContent = [
    { index: 1, title: 'ACUERDO DE TÉRMINOS LEGALES', content: `Somos FitaCompany (la "Compañía", "nosotros", "nuestro"), una compañía registrada en Chile, con domicilio en freire, rancagua, sexta región. Operamos la aplicación móvil Fita (la "App"), así como cualquier otro producto o servicio relacionado que se refiera o enlace a estos términos legales (los "Términos Legales") (colectivamente, los "Servicios").\n\nPuede contactarnos por teléfono al +5699977847588, por correo electrónico a FitaCompany@hotmail.com o por correo a freire, rancagua, sexta región, Chile.\n\nEstos Términos Legales constituyen un acuerdo legalmente vinculante entre usted, y FitaCompany, en relación con su acceso y uso de los Servicios. Al acceder a los Servicios, usted ha leído, entendido y acepta estar obligado por todos estos Términos Legales.` },
    { index: 2, title: 'NUESTROS SERVICIOS', content: `La información proporcionada al utilizar los Servicios no está destinada a ser distribuida ni utilizada por ninguna persona o entidad en ninguna jurisdicción o país donde dicha distribución o uso sea contrario a la ley o regulación.` },
    { index: 3, title: 'DERECHOS DE PROPIEDAD INTELECTUAL', content: `Somos propietarios o licenciatarios de todos los derechos de propiedad intelectual de nuestros Servicios, incluyendo todo el código fuente, bases de datos, funcionalidad, software, diseños, audio, video, texto, fotografías y gráficos (colectivamente, el "Contenido"), así como las marcas comerciales y logotipos (las "Marcas").\n\nSu uso de nuestros Servicios: Sujeto a su cumplimiento de estos Términos Legales, le otorgamos una licencia no exclusiva, intransferible y revocable para acceder y utilizar los Servicios únicamente para su uso personal y no comercial. Excepto lo dispuesto en esta sección, ninguna parte de los Servicios, Contenido o Marcas podrá ser copiada, reproducida, agregada, republicada, cargada o explotada para ningún propósito comercial.` },
    { index: 4, title: 'DECLARACIONES DEL USUARIO', content: `Al utilizar los Servicios, usted declara y garantiza que: (1) toda la información de registro que envíe es veraz, precisa y completa; (2) tiene capacidad legal para cumplir con estos Términos; (3) no es menor de edad en su jurisdicción o cuenta con el permiso de sus padres/tutores; y (4) no utilizará los Servicios con fines ilegales o no autorizados.` },
    { index: 5, title: 'REGISTRO DE USUARIO', content: `Es posible que se le solicite registrarse para utilizar los Servicios. Usted se compromete a mantener la confidencialidad de su contraseña y será responsable de todo uso de su cuenta y contraseña.` },
    { index: 6, title: 'COMPRAS Y PAGO', content: `Aceptamos formas de pago como Visa. Usted acepta proporcionar información de compra y de cuenta precisa. Todos los pagos se realizarán en pesos chilenos (CLP).` },
    { index: 7, title: 'SUSCRIPCIONES', content: `Facturación y Renovación: Su suscripción continuará y se renovará automáticamente a menos que se cancele. Usted acepta que carguemos su método de pago de forma recurrente sin requerir su aprobación previa.\n\nCancelación: Puede cancelar su suscripción en cualquier momento iniciando sesión en su cuenta. Su cancelación entrará en vigencia al final del plazo pagado actual.` },
    { index: 8, title: 'POLÍTICA DE REEMBOLSO', content: `Todas las ventas son finales y no se emitirá ningún reembolso.` },
    { index: 9, title: 'ACTIVIDADES PROHIBIDAS', content: `No podrá acceder o utilizar los Servicios para ningún propósito distinto al que los ponemos a disposición. Se prohíben, entre otras cosas, la recuperación sistemática de datos, el fraude, la interferencia con las funciones de seguridad, el uso para acosar o abusar de otras personas, la carga o transmisión de virus y el uso no autorizado de los Servicios para competir con nosotros.` },
    { index: 10, title: 'CONTRIBUCIONES GENERADAS POR EL USUARIO', content: `Al publicar Contribuciones (texto, fotos, etc.) en cualquier parte de los Servicios, usted nos otorga una licencia ilimitada, irrevocable, mundial y totalmente pagada para usar, copiar, reproducir, distribuir, publicar y explotar dichas Contribuciones con cualquier fin. Usted es el único responsable de lo que publique o cargue.` },
    { index: 11, title: 'LICENCIA DE APLICACIÓN MÓVIL', content: `Le otorgamos el derecho limitado a instalar y usar la App en dispositivos electrónicos inalámbricos de su propiedad. No debe descompilar, aplicar ingeniería inversa, modificar o crear obras derivadas de la App, ni utilizarla para un propósito para el que no está diseñada.` },
    { index: 12, title: 'SITIOS WEB Y CONTENIDO DE TERCEROS', content: `Los Servicios pueden contener enlaces a sitios web de terceros. No investigamos, monitoreamos ni verificamos la precisión o integridad de estos sitios y no somos responsables de ellos ni del contenido de terceros. Su acceso a estos es bajo su propio riesgo.` },
    { index: 13, title: 'ANUNCIANTES', content: `Permitimos a los anunciantes mostrar sus anuncios en ciertas áreas de los Servicios. Simplemente proporcionamos el espacio y no tenemos otra relación con los anunciantes.` },
    { index: 14, title: 'GESTIÓN DE SERVICIOS', content: `Nos reservamos el derecho de monitorear los Servicios en busca de violaciones, tomar medidas legales, negar el acceso a cualquier persona y gestionar los Servicios para proteger nuestros derechos y propiedad.` },
    { index: 15, title: 'POLÍTICA DE PRIVACIDAD', content: `Nos preocupamos por la privacidad y la seguridad de los datos. Al utilizar los Servicios, acepta estar sujeto a nuestra Política de Privacidad. Si accede desde fuera de Chile, consiente expresamente que sus datos sean transferidos y procesados en Chile.` },
    { index: 16, title: 'PLAZO Y TERMINACIÓN', content: `Estos Términos Legales permanecerán en pleno vigor mientras utilice los Servicios. Sin limitar otras disposiciones, nos reservamos el derecho de negar el acceso a los Servicios a cualquier persona, sin previo aviso ni responsabilidad, por cualquier motivo o por incumplimiento de estos Términos Legales.` },
    { index: 17, title: 'MODIFICACIONES E INTERRUPCIONES', content: `Nos reservamos el derecho de cambiar, modificar o eliminar el contenido de los Servicios en cualquier momento. No garantizamos que los Servicios estarán disponibles en todo momento y no seremos responsables por pérdidas, daños o inconvenientes causados por interrupciones o descontinuación de los Servicios.` },
    { index: 18, title: 'LEY APLICABLE', content: `Estos Términos Legales se regirán e interpretarán de acuerdo con las leyes de Chile. FitaCompany y usted consienten irrevocablemente que los tribunales de Chile tengan jurisdicción exclusiva para resolver cualquier disputa.` },
    { index: 19, title: 'RESOLUCIÓN DE DISPUTAS', content: `Cualquier disputa que surja en relación con estos Términos Legales se resolverá en los tribunales competentes de Chile. Las partes acuerdan que cualquier arbitraje se limitará a la disputa entre las partes individualmente.` },
    { index: 20, title: 'CORRECCIONES', content: `Nos reservamos el derecho de corregir errores, inexactitudes u omisiones en la información de los Servicios en cualquier momento sin previo aviso.` },
    { index: 21, title: 'DESCARGO DE RESPONSABILIDAD', content: `LOS SERVICIOS SE PROPORCIONAN "TAL CUAL" Y "SEGÚN DISPONIBILIDAD". USTED ACEPTA QUE EL USO DE LOS SERVICIOS ES BAJO SU PROPIO RIESGO. RECHAZAMOS TODAS LAS GARANTÍAS, EXPRESAS O IMPLÍCITAS.` },
    { index: 22, title: 'LIMITACIÓN DE RESPONSABILIDAD', content: `EN NINGÚN CASO NOSOTROS O NUESTROS DIRECTORES, EMPLEADOS O AGENTES SEREMOS RESPONSABLES ANTE USTED O CUALQUIER TERCERO POR DAÑOS DIRECTOS, INDIRECTOS, INCIDENTALES, ESPECIALES O PUNITIVOS. Nuestra responsabilidad total se limitará a la cantidad pagada por usted, si la hubiere, en los últimos doce (12) meses.` },
    { index: 23, title: 'INDEMNIZACIÓN', content: `Usted acepta defendernos, indemnizarnos y eximirnos de responsabilidad por cualquier pérdida, daño, responsabilidad, reclamo o demanda de terceros debido o derivado de su uso de los Servicios o el incumplimiento de estos Términos Legales.` },
    { index: 24, title: 'DATOS DEL USUARIO', content: `Mantenemos ciertos datos que usted transmite para gestionar el rendimiento de los Servicios. Usted es el único responsable de todos los datos que transmita.` },
    { index: 25, title: 'COMUNICACIONES ELECTRÓNICAS', content: `Usted da su consentimiento para recibir comunicaciones electrónicas y acepta que todos los acuerdos, avisos y divulgaciones que le proporcionamos electrónicamente cumplen con cualquier requisito legal de que dichas comunicaciones sean por escrito.` },
    { index: 26, title: 'VARIOS', content: `Estos Términos Legales y las políticas publicadas constituyen el acuerdo completo entre usted y nosotros. Nuestra incapacidad para ejercer cualquier derecho no operará como una renuncia a dicho derecho.` },
    { index: 27, title: 'CONTÁCTENOS', content: `Para resolver una queja o recibir más información sobre el uso de los Servicios, contáctenos en:\n\nFitaCompany\nfreire, rancagua, sexta región, Chile\nTeléfono: +5699977847588\nCorreo: fitacompany@hotmail.com` },
];

export default function TerminosCondicionesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.headerBg} barStyle="light-content" />
      
      {/* Header FITA Style */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Términos y Condiciones</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Título y Fecha */}
        <View style={styles.heroContainer}>
            <Text style={styles.documentTitle}>TÉRMINOS LEGALES DE USO</Text>
            <Text style={styles.lastUpdate}>Última actualización: 30 de noviembre de 2025</Text>
        </View>

        {/* Mapeo del Contenido Legal en Tarjetas */}
        {legalContent.map((section) => (
            <View key={section.index} style={styles.contentCard}>
                <SectionHeader index={section.index} title={section.title} />
                
                <View style={styles.divider} />
                
                {/* Renderizar el contenido usando un bucle para manejar saltos de línea con \n */}
                {section.content.split('\n').map((paragraph, pIndex) => {
                    const isContactInfo = section.index === 27 && pIndex > 1;
                    
                    // Identificar y dar formato especial a los enlaces de contacto y títulos clave
                    let formattedText = paragraph;
                    if (isContactInfo && formattedText.includes('fitacompany@hotmail.com')) {
                        formattedText = paragraph.replace('fitacompany@hotmail.com', 'fitacompany@hotmail.com');
                    }

                    return (
                        <Text key={pIndex} style={styles.paragraph}>
                            {formattedText.split(' ').map((word, wIndex) => {
                                if (word.includes('FitaCompany') || word.includes('Chile') || word.includes('freire')) {
                                    return <Text key={wIndex} style={styles.boldText}>{word} </Text>;
                                } else if (word.includes('fitacompany@hotmail.com')) {
                                     return <Text key={wIndex} style={styles.linkText}>{word} </Text>;
                                }
                                return word + ' ';
                            })}
                        </Text>
                    );
                })}
            </View>
        ))}

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
  
  // --- HEADER ---
  header: {
    backgroundColor: COLORS.headerBg,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    zIndex: 10,
  },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 20, color: '#FFF', fontWeight: 'bold' },
  
  // --- CONTENIDO PRINCIPAL ---
  scrollContent: { padding: 15, paddingBottom: 30 },

  heroContainer: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 15,
  },
  documentTitle: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: COLORS.textDark, 
    marginBottom: 5, 
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  lastUpdate: { 
    fontSize: 14, 
    color: COLORS.textMedium, 
    fontStyle: 'italic', 
    textAlign: 'center' 
  },
  
  // --- TARJETAS DE SECCIÓN ---
  contentCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    marginBottom: 25,
    elevation: 3,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // --- ENCABEZADOS DE SECCIÓN ---
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.headerBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    elevation: 2,
  },
  sectionTitleText: { 
    flex: 1,
    fontSize: 18, 
    fontWeight: '800', 
    color: COLORS.headerBg,
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
    marginLeft: 15,
    marginRight: 10,
  },
  
  // --- CUERPO DE TEXTO ---
  paragraph: { 
    fontSize: 14, 
    color: COLORS.textMedium, 
    lineHeight: 23, 
    textAlign: 'justify', 
    marginBottom: 10,
  },
  boldText: { 
    fontWeight: 'bold', 
    color: COLORS.textDark, 
  },
  linkText: { 
    color: COLORS.headerBg, 
    textDecorationLine: 'underline', 
    fontWeight: 'bold' 
  },
  
  // --- PIE DE PÁGINA ---
  footer: { 
    marginTop: 20, 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: '#EEEEEE', 
    paddingTop: 20 
  },
  footerText: { 
    color: COLORS.textMedium, 
    fontWeight: '600',
    fontSize: 12,
  }
});