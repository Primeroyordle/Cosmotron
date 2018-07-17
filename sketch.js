var camera;
//permet d'activer la camera dans un code

var canvas;
//périmètre de travail
var largeur = 700
//dimension du périmètre en largeur
var hauteur = 400
//dimension du périmètre en hauteur
var imgfond;
//permet de pouvoir afficher l'image de fond
var seuil = parseFloat(localStorage.getItem("seuil"))

//permet de définir la distance maximale tolérer entre la couleur que l'on veut repérer et la couleur de la camera
var slider;
//l'élèment graphique qui permet de modifié la vlaeur seuil
var couleuradetecter = [parseFloat(localStorage.getItem("Rouge")),parseFloat(localStorage.getItem("Vert")),parseFloat(localStorage.getItem("Bleu"))]
//permet de remplacer la couleur manuellement
var vid
//permet de lire une vidéo
var secondeCR = 7
//permet de créer le compte à rebours
var ListeImage = ["media/1.png", "media/2.jpg", "media/3.jpg"]
var PositionListe = 0
var buttonHide
var buttonPhoto
var buttonsuivant
var buttonvisible = true
var sliderchange

function setup() //appeler qu'une fois au début et elle nous sert à paramétrer toute nos variables
{
    canvas = createCanvas();
    //création de périmètre de travail
    camera = createCapture(VIDEO);
    canvas.size(largeur, hauteur)
    //taille de la largeur et de la hauteur
    slider = createSlider(0, 255, seuil)
    //permet de créer le curseur
    slider.position(100, 10);
    slider.input(sliderchange)
    //la position du curseur
    slider.style('width', '80px');
    //permet de donner la largeur du slider à 80px
    camera.size(largeur, hauteur);
    //taille de l'affichage de la vidéo
    pixelDensity(1)
    //dennsité des pixels
    camera.hide();
    //caméra caché
    frameRate(20);
    //nombre d'image par seconde
    //     imgfond = loadImage("media/1.png")
    chargerImg()
    //fichier à télécharger pour l'image de fond
    buttonPhoto = createButton('Photo');
    //créer le bouton
    buttonPhoto.position(643,7);
    //positionne
    buttonPhoto.mousePressed(comptearebours);
    //quand tu clique sur le bouton la fonction photo est apeller
    text()
    textSize(200)
    buttonsuivant = createButton("suivant")
    buttonsuivant.position(0,365)
    buttonsuivant.size(80,30)
    buttonsuivant.mousePressed(suivant)
    buttonHide = createButton('Cacher')
    buttonHide.mousePressed(hideshow)
    buttonHide.position(10, 80)
    buttonPleinEcran = createButton("PleinEcran")
    buttonPleinEcran.position(610,370)
    buttonPleinEcran.mousePressed(PleinEcran)
    buttonPleinEcran.size(80,28)
    buttonPhoto.size(50,30)
    buttonHide.size(70,30)

}
function draw() //dessiner chaque image que l'on voit à l'ecran
{
    image(imgfond, 0, 0, largeur, hauteur)
    //dessine l'image ou la vidéo en plein écran
    loadPixels()
    //charge les pixels
    dessinerCamera();
    //dessine la webcam
    seuil = slider.value();
    //prend la valeur du slider pour modifié le seuil
    updatePixels();
    //permet de charger les pixels en mouvement
    textAffiche();

}
function dessinerCamera() {
    if (camera.width == 0) {
        camera.width = camera.imageData.width
        camera.height = camera.imageData.height
    }
    //afficher l'image de la caméra
    camera.loadPixels();
    //telecharger les pixels de la vidéo
    if (camera.pixels.length) {
        //verifie que la caméra marche

        const w = largeur;
        //périmèetre de travail gauche
        const h = hauteur;
        //périmètre de travail droit
        for (let i = 0; i < w; i++) {
            //on se balade sur les colonnes
            for (let j = 0; j < h; j++) {
                //on se balade sur les lignes
                const position1dCanvas = (j * w + i) * 4;
                //sert à récuperer la position dans le tableau des pixels
                const r = camera.pixels[position1dCanvas + 0];
                //couleur rouge du pixel de la caméra
                const g = camera.pixels[position1dCanvas + 1];
                //couleur vert du pixel de la caméra
                const b = camera.pixels[position1dCanvas + 2];
                //couleur bleue du pixel de la caméra
                if (distance(r, g, b, couleuradetecter[0], couleuradetecter[1], couleuradetecter[2]) < seuil) {} else {
                    // si la distance des couleurs est inférieur à seuil alors...
                    pixels[position1dCanvas + 0] = r;
                    //afficher couleur rouge du pixel de la caméra
                    pixels[position1dCanvas + 1] = g;
                    //afficher couleur vert  du pixel de la caméra
                    pixels[position1dCanvas + 2] = b;
                    //afficher couleur bleue du pixel de la caméra

                }
            }
        }
    }
}

function distance(r1, g1, b1, r2, g2, b2) {
    //sert à afficher le résultat du calcul de couleur
    return (Math.abs(r2 - r1) + Math.abs(g2 - g1) + Math.abs(b2 - b1)) / 3
    //calcul la distance d'une couleur à une autre
}
function mouseClicked(e) {
    if (e.srcElement == canvas.canvas) {
        //fonction appeler quand la souris clock sur quelque choses
        var position1dCanvas = (mouseY * largeur + mouseX) * 4;
        //permet de detecter ou se situe la sourie en X et en Y
        couleuradetecter[0] = camera.pixels[position1dCanvas + 0]
        //sert a sauvegarder le pixel sous la souris quand la véritable couleur est detecter
        couleuradetecter[1] = camera.pixels[position1dCanvas + 1]
        //sert a sauvegarder le pixel sous la souris quand la véritable couleur est detecter
        couleuradetecter[2] = camera.pixels[position1dCanvas + 2]
        localStorage.setItem("Rouge",""+couleuradetecter[0])
        localStorage.setItem("Vert",""+couleuradetecter[1])
        localStorage.setItem("Bleu",""+couleuradetecter[2])
    }
}
//sert a sauvegarder le pixel sous la souris quand la véritable couleur est detecter
function Photo() // action du bouton
{
    saveCanvas(canvas, 'myCanvas', 'jpg');
    // permet de sauvegarder l'image 
}

function comptearebours() {
    //sert à activer un compte a rebours
    secondeCR = secondeCR - 1
    if (secondeCR == 0) {
        Photo()
        secondeCR = 7
    } else {
        setTimeout(comptearebours, 1000)
    }
}
function textAffiche() {
    //sert a afficher le compteur

    if (secondeCR == 6) {
        text('5', 250, 250)

    }
    if (secondeCR == 5) {
        text('4', 250, 250)
    }
    if (secondeCR == 4) {
        text('3', 250, 250)

    }
    if (secondeCR == 3) {
        text('2', 250, 250)

    }
    if (secondeCR == 2) {
        text('1', 250, 250)

    }
    if (secondeCR == 1) {
       
    }
}

function suivant() {

    if (PositionListe < ListeImage.length - 1) {
        PositionListe = PositionListe + 1;
    } else {
        PositionListe = 0;

    }

    chargerImg()
}
function chargerImg() {
    imgfond = loadImage(ListeImage[PositionListe])

}

function hideshow() {
    if (buttonvisible == true) {
        buttonPhoto.hide()
        buttonsuivant.hide()
        slider.hide()
        buttonPleinEcran.hide()
        buttonvisible = false
    } else {
        buttonPhoto.show()
        buttonsuivant.show()
        slider.show()
        buttonPleinEcran.show()
        buttonvisible = true
    }

}

function sliderchange() {
    localStorage.setItem("seuil", "" + seuil)
}

function windowResized() {
    largeur = windowWidth
    hauteur = windowHeight
    canvas.size(largeur, hauteur)
    camera.size(largeur, hauteur)
}
function PleinEcran() {
    var fs = fullscreen()
    fullscreen(!fs);

}

