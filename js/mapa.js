
const resources = { // Informacion con las secciones del mapa
    "Home" : { // Objeto con la URL y el texto de la seccion
        "info_img" : "imagenes/enamorate.jpg",
        "text_info": "<b>¡Bienvenidos a Nobsa!</b> <br> Conoece algunos de los puntos de interés de nuestro municipio. <br>Dale clic a algún pin y descubrirás más información de los lugares para visitar en Nobsa."
            },
    "Viñedo": { // Objeto con la URL y el texto de la seccion
        "video_url": "https://www.youtube.com/embed/BCKjbF-pVv4",
        "text_info": "<b>Viñedo Marqués de Puntalarga</b> <br> <br> En un entorno consentido por la luz, los matices y las tonalidades, como el valle del sol, es de esperar que la vida nos informe, a través de los colores, aromas y sabores de los vinos. Un lugar recomendado para visitar en cualquier época del año, pero en enero se realiza el festival de vid y vino. Recomendado."
    },
    "Parque Principal e Iglesia": {// Objeto con la URL y el texto de la seccion
        "video_url": "https://www.youtube.com/embed/yRODqvF_dcs",
        "text_info": "<b>Parque Principal e Iglesia</b> <br> Nobsa es un municipio turístico boyacense que se caracteriza por su tradición artesanal, cultural y los viñedos. Su ubicación hace muy fácil visitarlo, la cercanía con Bogotá y Tunja, las buenas carreteras y la seguridad vial, nos permiten realizar un viaje muy tranquilo y placentero, admirando el paisaje , realizando una que otra parada para comprar frutas y mecato de la región. En el parque principal encontrarás todo tipo de postres y golosinas hechas con frutas de la región, además podrás encontrar la iglesia principal que es digna de ser visitada."
    },
    "Capilla de Lourdes": {// Objeto con la URL y el texto de la seccion
        "info_img": "imagenes/capilla-de-lourdes-nobsa-boyacá.jpg",
        "text_info": "<b>Capilla de Lourdes</b> <br> Situada en el monte denominado 'El Calvario', a unas cuantas de el parque principal se encuentra la Capilla de Lourdes, uno de los principales bienes culturales y religiosos del municipio de Nobsa Boyacá ."
    },
    "Cementos Holcim": {// Objeto con la URL y el texto de la seccion
        "video_url": "https://www.youtube.com/embed/zHn2bzpn0ZA",
        "text_info": "<b>Cementos Holcim</b> <br> Holcim (Colombia) S.A. es una empresa perteneciente al grupo suizo Holcim, líder en la industria mundial del cemento y uno de los principales proveedores de cemento, concreto y agregados y de todos los servicios relacionados con la construcción. Tiene intereses mayoritarios y minoritarios en alrededor de 70 países de todos los continentes y una nómina de unos 80 mil empleados a nivel mundial. Una de sus plantas está en la entrada al centro de Nobsa.  "
    },
    "Acerias Paz del Rio": {// Objeto con la URL y el texto de la seccion
        "video_url": "https://www.youtube.com/embed/lRRSvgviNsM",
        "text_info": "<b>Acerias Paz del Rio</b> <br> Acerías Paz del Río es la segunda empresa siderúrgica más grande de Colombia, propiedad del grupo empresarial Trinity Capital. Creada en el año 1948 con el nombre de Empresa Siderúrgica Nacional de Paz de Río. La producción en pleno de la compañía se inició en 1954, cuando pasó a llamarse Acerías Paz del Río, S.A. En el año 2007 el grupo empresarial brasileño Votorantim adquirió el 51.1% de las acciones de la compañía. Actualmente, es responsable del 30% de la fabricación de acero en Colombia."
    },
    "Cruz de Aranda": {// Objeto con la URL y el texto de la seccion
        "video_url": "https://www.youtube.com/embed/J_y_0_4haHc",
        "text_info": "<b>Cruz de Aranda</b> <br> Dicen los antiguos pobladores, que cuando aún no había desecación, todo el pintoresco Valle del rincón Nobsano era una inmensa laguna, y sin embargo las fértiles estribaciones de las circundantes lomas la presentaban como un pesebre de agricultores y de hombres con fortuna. Narran, aun con honor, como Satán guindaba su hamaca en las noches entre los cerros de Dungua y de Chacón, y meciendo su jartera se echaba a roncar y en esta apacible población no había tranquilidad. Tantos desmanes cometió esa criatura infernal y entre ellas la que hizo arder la iglesia parroquial, los creyentes entonces en comunidad, decidieron para siempre desterrar de este hermoso valle, esa horrible criatura llamada Satanás. El padre José Agustín Aranda, en el año de 1885, el tres de mayo reflexiono con algunos de sus feligreses y optaron por la más práctica y real, en el cerro el Tungón, se erigió y entronizo para siempre la sagrada y venerada cruz, como guardia celoso no deja acercar a esa criatura infernal. Y en esta comarca reinaría por siempre la paz. Por ser el sitio más alto y distante del pueblo se llevó con veneración la sagrada cruz en penitente peregrinación el sitio, que andando el tiempo los hombres de Nobsa, Cruz de Aranda la llamaron. Esta primera cruz era hecha de madera y en forma cuadrada y totalmente forrada en lata, espectacular revestimiento desde la distancia en noche o en día era bien definido su destello. Pero... no duró lo suficiente la intemperie y la inclemencia fueron implacables y la destruyó totalmente... Para entonces el sitio ya era conocido como Cruz de Aranda. El Padre Francisco Becerra en mayo 13 de 1931, volvió con sus católicos creyentes, a construir una cruz en cemento y en sitio denominado; de la Porquera; y desde allí llevada en memorable procesión de vía crucis, el domingo 14 de junio de 1931 al lugar que decían los creyentes que allí estuvo la cruz del padre Aranda. Erigida y entronizada. Duró en pie y erguida hasta el año de 1957, en los que algunos afirmaban que un rayo la quebró de su base y le partió su parte superior, doblándola sobre la inmensa roca. Ligada a su paso Cruz dejó un recuerdo de leyenda porque a partir de entonces, sin existir la Cruz, los paisanos de Nobsa continuaron llamando así ese paraje agreste de nuestro campo vernáculo, por todos fue conocido así ese lugar."
    }, 
    
}

function ResetVideo(){ // Deja los valores en ninguno
    document.getElementById("info_video").style.display = "none";
    document.getElementById("info_video").src = "none";
}
function muestraImg(section){ // Funcion para texto e imagen
    ResetVideo(); // Reiniciar la informacion 
    document.getElementById("info_img").style.display = "block"; // Mostrar imagen 
    document.getElementById("info_img").src = resources[section]["info_img"]; // Scroll hasta la seccion 
    document.getElementById("text_info").innerHTML = resources[section]["text_info"]; // Texto
    document.getElementById("Info").scrollIntoView(); // Scroll hasta la seccion 
}

function muestraVideo(section) { // Funcion para texto y video
    document.getElementById("info_img").style.display = "none"; // Set display image to none
    document.getElementById("info_video").style.display = "block"; // Muestra el video
    document.getElementById("info_video").src = resources[section]["video_url"]; // URL
    document.getElementById("text_info").innerHTML = resources[section]["text_info"]; // Texto
    document.getElementById("Info").scrollIntoView(); // Scroll hasta la seccion 
}