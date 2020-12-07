$(document).ready(function() {

    //Declaración de variables globales
    var _URL = window.URL || window.webkitURL;
    var extensionesValidas = ".jpg";
    var anchoImagen = 0;
    var altoImagen = 0;
    var anchoHoja = 796;
    var altoHoja = 1123;

    //Cuando cambie el fichero
    $("#fichero").change(function(e) {
        $('#texto').text('');
        $('#img').attr('src', '');

        if (validarExtension(this)) {
            obtenerDimension(this);
            anchoImagen = localStorage.getItem('width');
            altoImagen = localStorage.getItem('height');
            orientacion(this, anchoImagen, altoImagen);
            //verImagen(this);
        }

    });

    // Validacion de extensiones permitidas

    function validarExtension(datos) {
        var ruta = datos.value;
        var extension = ruta.substring(ruta.lastIndexOf('.') + 1).toLowerCase();
        var extensionValida = extensionesValidas.indexOf(extension);

        if (extensionValida < 0) {
            $('#texto').text('La extensión no es válida Su fichero tiene de extensión: .' + extension);
            return false;
        } else {
            return true;
        }
    }

    // Vista preliminar de la imagen.
    function verImagen(datos, anchoHoja, altoHoja) {
        if (datos.files && datos.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#img').attr('src', e.target.result);
                ModificarHoja(anchoHoja, altoHoja);
            };

            reader.readAsDataURL(datos.files[0]);
        }
    }

    function obtenerDimension(dato) {
        var _URL = window.URL || window.webkitURL;
        var file, img;

        if ((file = dato.files[0])) {
            img = new Image();
            img.onload = function() {
                localStorage.setItem('width', this.width);
                localStorage.setItem('height', this.height);
            };
            img.src = _URL.createObjectURL(file);

        }
        return true;
    }

    function orientacion(dato, anchoImagen, altoImagen) {
        var ancho = parseInt(anchoImagen);
        var alto = parseInt(altoImagen);
        if (ancho != alto) {
            // Validar la orientacion horizontal
            if (ancho > alto) {
                anchoHoja = 1123;
                altoHoja = 796;
                // se valida la relación de la hoja para definir edición de imagen
                var relacionHoja = altoHoja / anchoHoja;
                var relacionImagen = alto / ancho;
                if ((ancho <= anchoHoja) && (alto <= altoHoja)) {
                    // La imagen cabe en la hoja
                    verImagen(dato, anchoHoja, altoHoja);
                } else if ((ancho > anchoHoja) && (alto <= altoHoja)) {
                    //la imagen se sale por lo ancho
                    EditarAncho(dato, anchoHoja, altoHoja);
                } else if ((alto > altoHoja) && (ancho <= anchoHoja)) {
                    // La imagen se sale por lo alto
                    EditarAlto(dato, anchoHoja, altoHoja);
                } else {
                    if (relacionImagen > relacionHoja) {
                        EditarAlto(dato, anchoHoja, altoHoja);
                    } else {
                        EditarAncho(dato, anchoHoja, altoHoja);
                    }
                }
            } else {
                // La orientación es vertical
                anchoHoja = 796;
                altoHoja = 1123;
                // Se calcula la relación de la hoja verticalmente
                var relacionHoja = altoHoja / anchoHoja;
                var relacionImagen = alto / ancho;
                if ((ancho <= anchoHoja) && (alto <= altoHoja)) {
                    // La imagen cabe en la hoja verticalmente
                    verImagen(dato, anchoHoja, altoHoja);
                } else if ((ancho > anchoHoja) && (alto <= altoHoja)) {
                    // La imagen se sale de lo ancho, pero no de lo alto verticalmente
                    EditarAncho(dato, anchoHoja, altoHoja);
                } else if ((alto > altoHoja) && (ancho <= anchoHoja)) {
                    // La imagen se sale de lo alto, pero no de lo ancho verticalmente
                    EditarAlto(dato, anchoHoja, altoHoja);
                } else {
                    if (relacionImagen > relacionHoja) {
                        // Se edita la imagen de alto verticalmente
                        EditarAlto(dato, anchoHoja, altoHoja);
                    } else {
                        // Se edita la imagen de ancho verticalmente
                        EditarAncho(dato, anchoHoja, altoHoja);
                    }
                }
            }
        } else if ((ancho <= anchoHoja)) {
            //if ((ancho <= anchoHoja)) {
            verImagen(dato, anchoHoja, altoHoja);
        } else {
            EditarAncho(dato, anchoHoja, altoHoja);
        }
    }

    // Editar y ver preliminar la imagen a lo ancho
    function EditarAncho(datos, anchoHoja, altoHoja) {
        if (datos.files && datos.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#img').attr('src', e.target.result);
                // se edita la imagen a lo ancho de acuerdo con la hoja
                $('#img').attr('style', 'width:' + anchoHoja + 'px');
                ModificarHoja(anchoHoja, altoHoja);
            };

            reader.readAsDataURL(datos.files[0]);
        }
    }

    // Editar y ver preliminar la imagen a lo alto
    function EditarAlto(datos, anchoHoja, altoHoja) {
        if (datos.files && datos.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#img').attr('src', e.target.result);
                // Se edita la imagen de acuerdo con el alto de la hoja
                $('#img').attr('style', 'height:' + altoHoja + 'px');
                ModificarHoja(anchoHoja, altoHoja);
            };

            reader.readAsDataURL(datos.files[0]);
        }
    }

    function ModificarHoja(anchoHoja, altoHoja) {
        document.getElementById('emulador').style.display = 'block';
        document.getElementById('card').style.display = 'none';
        document.getElementById('hojaA4').style.width = anchoHoja + 'px';
        document.getElementById('hojaA4').style.height = altoHoja + 'px';
    }

    $('#btn-return').click(function() {
        document.getElementById('emulador').style.display = 'none';
        document.getElementById('card').style.display = 'block';
    });

});