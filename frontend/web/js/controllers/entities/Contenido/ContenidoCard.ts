/// <reference path="../../../../typings/jquery/jquery.d.ts" />

module ILovePlatos{

    declare var PlayBuzz:any;
    declare var instgrm:any;
    declare var cordova:any;
    declare var ImgCache:any;

    export class ContenidoCard{

        controller:RestaurantController;

        constructor(controller) {
            this.controller = controller;
        }

        getTags(card) {
            var tags;
            if(card && card.relationships && card.relationships.tags) {                
                tags = card.relationships.tags;
                return tags.data;
             }
             return false;
        }

        getUrlContenido(card:iDataApirest) {
            var url = '';
            var categoria = 'contenido';
            if(!card) {
                return '';
            }
            if( card.relationships && card.relationships.categorias && card.relationships.categorias.data && card.relationships.categorias.data && card.relationships.categorias.data[0] && card.relationships.categorias.data[0].id) {
                categoria = card.relationships.categorias.data[0].id
            }


            if(card && card.attributes && card.attributes.urlDestino) {
                url = card.attributes.urlDestino;
            }
            else if(card && card.attributes && card.attributes.id && card.attributes.numeroDeReposts != "0") {
                url = this.controller.$state.href('contenido',{categoria:categoria,slug:card.attributes.slug,id:card.attributes.id});
            }
            else if(card && card.id && card.attributes && card.attributes.slug) {
                url = this.controller.$state.href('contenido',{categoria:categoria,slug:card.attributes.slug,id:card.id});
            }
            else if(card && card.id) {
                url = this.controller.$state.href('contenido',{categoria:categoria,id:card.id});
            }
            return url;
        }

        getCategoriaByContenido(card) {
            var categoria = {};
            if( card.relationships && card.relationships.categorias && card.relationships.categorias.data && card.relationships.categorias.data && card.relationships.categorias.data[0] && card.relationships.categorias.data[0].id) {
                categoria = card.relationships.categorias.data[0];
            }
            return categoria;
        }

        getSubcategoriasByContenido(card) {
            var subcategorias = [];
            if( card.relationships && card.relationships.subcategorias && card.relationships.subcategorias.data && card.relationships.subcategorias.data) {
                subcategorias = card.relationships.subcategorias.data;
            }
            return subcategorias;
        }

        getClassTitulo(card:iDataApirest) {
            var size = 'fs-xl';
            if(card && card.attributes && card.attributes.titulo && card.attributes.titulo.length > 25 && card.attributes.titulo.length <= 40) {
                size = 'fs-l';
            }
            else if(card && card.attributes && card.attributes.titulo && card.attributes.titulo.length > 40 && card.attributes.titulo.length <= 50) {
                size = 'fs-m';
            }
            else if(card && card.attributes && card.attributes.titulo && card.attributes.titulo.length > 50 && card.attributes.titulo.length <= 60) {
                size = 'fs-s';
            }
            else if(card && card.attributes && card.attributes.titulo && card.attributes.titulo.length > 60) {
                size = 'fs-xs';
            }
            return size;
        }

        getClassSubTitulo(card:iDataApirest) {
            var size = 'fs-s';
            if(card && card.attributes && card.attributes.subtitulo && card.attributes.subtitulo.length > 70) {
                size = 'fs-xs';
            }
            return size;
        }

        getSrcMiniaturasByRecorte(card,sizeRecorte) {
            if(!sizeRecorte) {
                sizeRecorte = 'recortada1';
            }
            var url = '';
            if(card && card.relationships && card.relationships.miniaturas && card.relationships.miniaturas.data && card.relationships.miniaturas.data[0] && card.relationships.miniaturas.data[0].recortadas) {

                if(card.relationships.miniaturas.data[0].recortadas[sizeRecorte]) {
                    url = card.relationships.miniaturas.data[0].recortadas[sizeRecorte].url;
                    url = this.controller._main.cleanRelativeUrl(url);
                }
            }
            return url;
        }

        getSrcMiniaturasOriginal(card:iDataApirest) {
            var url = '';
            if(card && card.relationships && card.relationships.miniaturas && card.relationships.miniaturas.data && card.relationships.miniaturas.data[0] && card.relationships.miniaturas.data[0].url) {
                url = card.relationships.miniaturas.data[0].url;
                url = this.controller._main.cleanRelativeUrl(url);
            }
            return url;
        }

        getSrcMiniaturasApaisadaHD(card:iDataApirest) {
            var url = '';
            if(card && card.attributes && card.attributes.preview && card.attributes.preview.images && card.attributes.preview.images[0] && card.attributes.preview.images[0].recortadas && card.attributes.preview.images[0].original) {
                url =  card.attributes.preview.images[0].original.url;
                url = this.controller._main.cleanRelativeUrl(url);
            }
            else if(card && card.relationships && card.relationships.miniaturas && card.relationships.miniaturas.data && card.relationships.miniaturas.data[0] && card.relationships.miniaturas.data[0].recortadas && card.relationships.miniaturas.data[0].recortadas['recortada1HD']) {
                url = card.relationships.miniaturas.data[0].recortadas['recortada1HD'].url;
                url = this.controller._main.cleanRelativeUrl(url);
            }
            return url;
        }

        getSrcMiniaturasMiniatura(card:iDataApirest) {
            var url = '';
            if(card && card.relationships && card.relationships.miniaturas && card.relationships.miniaturas.data && card.relationships.miniaturas.data[0] && card.relationships.miniaturas.data[0].urlMiniatura) {
                url = card.relationships.miniaturas.data[0].urlMiniatura;
                url = this.controller._main.cleanRelativeUrl(url);
            }
            return url;
        }

        getSrcMiniaturasForm(card:iDataApirest) {
            var url = 'images/dummy.jpg';
            if(card && card.attributes && card.attributes.preview && card.attributes.preview.image) {

                url = card.attributes.preview.image;
                url = this.controller._main.cleanRelativeUrl(url);

            }else if(card && card.relationships && card.relationships.miniaturas && card.relationships.miniaturas.data && card.relationships.miniaturas.data[0] && card.relationships.miniaturas.data[0].url) {

                url = card.relationships.miniaturas.data[0].url;
                url = this.controller._main.cleanRelativeUrl(url);

            }
            return url;
        }

        getSrcMiniaturasRecortada(card:iDataApirest,element?) {
            var url = '';

            if(card && card.attributes && card.attributes.preview && card.attributes.preview.images && card.attributes.preview.images[0] && card.attributes.preview.images[0].recortadas) {

                var sizeRecorte = this.controller.getSizeRecorte(card);
                if(card.attributes.preview.images[0].recortadas[sizeRecorte]) {
                    url = card.attributes.preview.images[0].recortadas[sizeRecorte].url;
                    url = this.controller._main.cleanRelativeUrl(url);
                }

            }else if(card && card.relationships && card.relationships.miniaturas && card.relationships.miniaturas.data && card.relationships.miniaturas.data[0] && card.relationships.miniaturas.data[0].recortadas) {

                var sizeRecorte = this.controller.getSizeRecorte(card);
                if(card.relationships.miniaturas.data[0].recortadas[sizeRecorte]) {
                    url = card.relationships.miniaturas.data[0].recortadas[sizeRecorte].url;
                    url = this.controller._main.cleanRelativeUrl(url);
                }
            }

            return url;
        }

        getCacheSrcMiniaturasRecortada(card:iDataApirest,element?) {
            var url = '';

            if(card && card.attributes && card.attributes.preview && card.attributes.preview.images && card.attributes.preview.images[0] && card.attributes.preview.images[0].recortadas) {

                var sizeRecorte = this.controller.getSizeRecorte(card);
                if(card.attributes.preview.images[0].recortadas[sizeRecorte]) {
                    url = card.attributes.preview.images[0].recortadas[sizeRecorte].url;
                    url = this.controller._main.cleanRelativeUrl(url);
                }

            }else if(card && card.relationships && card.relationships.miniaturas && card.relationships.miniaturas.data && card.relationships.miniaturas.data[0] && card.relationships.miniaturas.data[0].recortadas) {

                var sizeRecorte = this.controller.getSizeRecorte(card);
                if(card.relationships.miniaturas.data[0].recortadas[sizeRecorte]) {
                    url = card.relationships.miniaturas.data[0].recortadas[sizeRecorte].url;
                    url = this.controller._main.cleanRelativeUrl(url);
                }
            }

            //if(cordova != 'undefined' && url) {
                //if(url == "http://production-cms.s3-eu-central-1.amazonaws.com/wp-content/uploads/2016/06/06035513/iStock_000020030068_Medium-675x1156-1464944700.jpg") {
                        ImgCache.isCached(url, function(path, success){
                          if(success){
                            // already cached
                            ImgCache.useCachedFile($(element),function(success){
                                console.log('ok');
                               } ,function(e){
                                console.log('ko');
                                });
                          } else {
                            // not there, need to cache the image
                            ImgCache.cacheFile(path, function(){
                              ImgCache.useCachedFile($(element),function(success){
                                console.log('ok');
                               } ,function(e){
                                console.log('ko');
                                });
                            },function() {
                                $(element).attr('src',url);
                            });
                          }
                        });
                //}
            //}

            return url;
        }

        getSrcMiniaturasOrGaleriaRecortada(card:iDataApirest) {
            if(card && this.getSrcMiniaturasRecortada(card)) {

                return this.getSrcMiniaturasRecortada(card);

            }else if(card && this.controller.getSrcFirstImageGaleriaRecortada(card)) {

                return this.controller.getSrcFirstImageGaleriaRecortada(card);

            }
            return '';
        }

        getSrcFirstImageGaleriaOriginal(card:iDataApirest) {
            var url = '';
            if(card && card.relationships && card.relationships.galerias && card.relationships.galerias.data && card.relationships.galerias.data[0] && card.relationships.galerias.data[0].url) {
                url = card.relationships.galerias.data[0].url;
                url = this.controller._main.cleanRelativeUrl(url);
            }
            return url;
        }

        getSrcFirstImageGaleriaRecortada(card:iDataApirest) {
            var url = '';
            if(card && card.relationships && card.relationships.galerias && card.relationships.galerias.data && card.relationships.galerias.data[0] && card.relationships.galerias.data[0].url) {

                var sizeRecorte = this.controller.getSizeRecorte(card);

                if(card.relationships.galerias.data[0].recortadas) {
                    url = card.relationships.galerias.data[0].recortadas[sizeRecorte].url;
                    url = this.controller._main.cleanRelativeUrl(url);
                }

            }
            return url;
        }

        classRepost(card) {
            if(card && card.attributes && card.attributes.numeroDeReposts > 0) {
                return 'repost';
            }else {
                return '';
            }
        }

        getTitulo(card) {
            if(card && card.attributes && card.attributes.titulo) {
                return card.attributes.titulo;
            }
            return '';
        }

        getSubTitulo(card) {
            if(card && card.attributes && card.attributes.subtitulo ) {
                var res = this.controller.filterNoContent(card.attributes.subtitulo);
                return res;
            }
            return '';
        }

        existPrePreview() {
            if(this.controller.preview && this.controller.preview.title && this.controller.preview.title != 'Enter a title') {
                return true;
            }
            return false;
        }

        existPreview(card) {
            if(card && card.attributes && card.attributes.preview && card.attributes.preview.title) {
                return true;
            }
            return false;
        }

        existVideoPreview(card) {
            if(card && card.attributes && card.attributes.preview && card.attributes.preview.video) {
                return true;
            }
            return false;
        }

        existImagePreview(card) {
            if(card && card.attributes && card.attributes.preview && card.attributes.preview.images && card.attributes.preview.images[0] && card.attributes.preview.images[0]['original']) {
                return true;
            }
            return false;
        }

        getVideoPreview(card) {
            if(card && card.attributes && card.attributes.preview && card.attributes.preview.video) {
                return this.controller.$sce.trustAsHtml(_.unescape(card.attributes.preview.videoIframe));
            }
            return false;
        }

        getImagePreview(card) {
            var url = '';
            if(card && card.attributes && card.attributes.preview && card.attributes.preview.images && card.attributes.preview.images[0] && card.attributes.preview.images[0]['original']) {
                url = card.attributes.preview.images[0]['original'].url;
                url = this.controller._main.cleanRelativeUrl(url);
            }
            return url;
        }

        getBodyPreview(card) {
            if(card && card.attributes && card.attributes.preview && card.attributes.preview.description) {
                return card.attributes.preview.description;
            }
            return '';
        }

        getSizeRecorte(card:iDataApirest) {
            var $tipoDeModulo = card.attributes.tipoDeModulo;
            var $usarImagenDeFondo = card.attributes.usarImagenDeFondo;
            var $relevancia = card.attributes.relevancia;

            var max_width =  1023;
            var window_width = angular.element(document).width();

            if(window_width > max_width) {
                if($tipoDeModulo == 'horizontal') {
                    $tipoDeModulo = 'vertical';
                }
            }

            //Elegimos la miniatura en función de la Altura, el tipo de modulo y si se va a usar o no como background.
            var $sizeRecorte = 'recortada1';
            if ($tipoDeModulo == 'vertical' && $usarImagenDeFondo && $usarImagenDeFondo != "0") {
                switch ($relevancia){
                    case '1-4':
                        $sizeRecorte = 'recortada1';
                        break;
                    case '2-4':
                        $sizeRecorte = 'recortada2';
                        break;
                    case '3-4':
                        $sizeRecorte = 'recortada3';
                        break;
                    case '4-4':
                        $sizeRecorte = 'recortada4';
                        break;
                }
            }
            else if ($tipoDeModulo == 'vertical' && (!$usarImagenDeFondo || $usarImagenDeFondo == "0")) {
                switch ($relevancia){
                    case '1-4':
                        $sizeRecorte = 'recortada1';
                        break;
                    case '2-4':
                        $sizeRecorte = 'recortada1';
                        break;
                    case '3-4':
                        $sizeRecorte = 'recortada2';
                        break;
                    case '4-4':
                        $sizeRecorte = 'recortada3';
                        break;
                }
            }
            else if( ($tipoDeModulo == 'portada') ) {
                $sizeRecorte = 'portada';
                if(!card.relationships.miniaturas.data[0].recortadas[$sizeRecorte]) {
                    $sizeRecorte = 'recortada3';
                }
            }
            else if( ($tipoDeModulo == 'noticia-principal')) {
                $sizeRecorte = 'noticia-principal';
                if(!card.relationships.miniaturas.data[0].recortadas[$sizeRecorte]) {
                    $sizeRecorte = 'recortada1';
                }
            }
            else if ($tipoDeModulo == 'horizontal' && (!$usarImagenDeFondo || $usarImagenDeFondo == "0")){
                switch ($relevancia){
                    case '1-4':
                        $sizeRecorte = 'recortada1';
                        break;
                    case '2-4':
                        $sizeRecorte = 'recortada1';
                        break;
                    case '3-4':
                        $sizeRecorte = 'recortada2';
                        break;
                    case '4-4':
                        $sizeRecorte = 'recortada2';
                        break;
                }
            }
            else{
                switch ($relevancia){
                    case '1-4':
                        $sizeRecorte = 'horizontal1';
                        break;
                    case '2-4':
                        $sizeRecorte = 'recortada1';
                        break;
                    case '3-4':
                        $sizeRecorte = 'horizontal3';
                        break;
                    case '4-4':
                        $sizeRecorte = 'recortada2';
                        break;
                }
            }

            return $sizeRecorte;
        }

        showMiniaturaInsidePost(card:iDataApirest) {
            if(card && card.attributes && card.attributes.mostrarMiniaturaDentro) {
                return card.attributes.mostrarMiniaturaDentro;
            }
            return 1;
        }

        hasImagenBackground(card:iDataApirest) {
            if(card && card.attributes && card.attributes.usarImagenDeFondo && card.attributes.usarImagenDeFondo != "0") {
                return card.attributes.usarImagenDeFondo;
            }else {
                return '';
            }
        }

        getLeyendaMiniaturas(card:iDataApirest) {
            if(card && card.attributes && card.attributes.preview && card.attributes.preview.description) {
                return card.attributes.preview.description;
            }
            else if(card && card.relationships && card.relationships.miniaturas && card.relationships.miniaturas.data && card.relationships.miniaturas.data[0] && card.relationships.miniaturas.data[0].leyenda && card.relationships.miniaturas.data[0].leyenda != '-1') {
                var leyenda = card.relationships.miniaturas.data[0].leyenda;
                if(leyenda != '&nbsp;') {
                    return leyenda;
                }
                return '';
            }
            return '';
        }


        getCopyrightMiniaturas(card:iDataApirest) {
            if(card && card.attributes && card.attributes.preview && card.attributes.preview.canonicalUrl) {
                return card.attributes.preview.canonicalUrl;
            }
            else if(card && card.relationships && card.relationships.miniaturas && card.relationships.miniaturas.data && card.relationships.miniaturas.data[0] && card.relationships.miniaturas.data[0].copyright && card.relationships.miniaturas.data[0].copyright != '-1') {
                var copyright = card.relationships.miniaturas.data[0].copyright;
                if(copyright != '&nbsp;') {
                    return copyright;
                }
                return '';
            }
            return '';
        }

        getSrcVideos(card:iDataApirest) {
            if(card && card.relationships && card.relationships.videos && card.relationships.videos.data && card.relationships.videos.data[0] && card.relationships.videos.data[0].url) {
                return card.relationships.videos.data[0].url;
            }
            return '';
        }

        getSrcMiniaturaVideo(card:iDataApirest) {
            var recorte = this.getSrcMiniaturasRecortada(card);
            if(recorte || recorte != '' ){
                return recorte;
            }else{
                var url = this.controller.getSrcVideos(card);

                if(card && card.relationships && card.relationships.videos && card.relationships.videos.data && card.relationships.videos.data[0] && card.relationships.videos.data[0].servidor) {
                    var servidor = card.relationships.videos.data[0].servidor;
                    var urlMiniatura;
                    if(servidor == "youtube"){
                        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                        var match = url.match(regExp);
                        if (match && match[2].length == 11) {
                          var idYoutube = match[2];
                          return 'http://img.youtube.com/vi/'+idYoutube+'/0.jpg';
                        }else{
                            //console.log("Url incorrecta: " + url);
                        }
                    }else if(servidor == "vimeo"){
                        $.getJSON('http://vimeo.com/api/oembed.json?url=' + url).success(function(result){
                            angular.element('#image-'+card.id).attr('src',result.thumbnail_url);
                        });
                    }
                }
            }
            return '';

        }

        getSrcFirstImgGaleria(card:iDataApirest) {
            if(card && card.relationships && card.relationships.galerias && card.relationships.galerias.data && card.relationships.galerias.data[0] && card.relationships.galerias.data[0].url) {
                return card.relationships.galerias.data[0].url;
            }
            return '';
        }

        getColorDeFondo(card:iDataApirest) {
            if(card && card.relationships && card.relationships.colorDeFondo && card.relationships.colorDeFondo.data && card.relationships.colorDeFondo.data[0] && card.relationships.colorDeFondo.data[0].css) {
                var hash = '';
                var color = card.relationships.colorDeFondo.data[0].css;
                if(color.indexOf('#') == -1) {
                    hash = '#';
                }
                return hash+color;
            }
            return '';
        }

        getImagenDeFondo(card:iDataApirest) {
            if(card && card.relationships && card.relationships.imagenDeFondo && card.relationships.imagenDeFondo.data && card.relationships.imagenDeFondo.data[0] && card.relationships.imagenDeFondo.data[0].src) {
                var src = card.relationships.imagenDeFondo.data[0].src;
                return src;
            }
            return '';
        }

        getColorDeCapaTransparente(card:iDataApirest) {
            if(card && card.relationships && card.relationships.colorDeCapaTransparente && card.relationships.colorDeCapaTransparente.data && card.relationships.colorDeCapaTransparente.data[0] && card.relationships.colorDeCapaTransparente.data[0].css) {
                var hash = '';
                var color = card.relationships.colorDeCapaTransparente.data[0].css;
                if(color.indexOf('#') == -1) {
                    hash = '#';
                }
                return hash+color;
            }
            return '';
        }

        getColorTextoContenedorTarjeta(card:iDataApirest) {
            if(card && card.relationships && card.relationships.colorTextoContenedorTarjeta && card.relationships.colorTextoContenedorTarjeta.data && card.relationships.colorTextoContenedorTarjeta.data[0] && card.relationships.colorTextoContenedorTarjeta.data[0].css) {
                var hash = '';
                var color = card.relationships.colorTextoContenedorTarjeta.data[0].css;
                if(color.indexOf('#') == -1) {
                    hash = '#';
                }
                return hash+color;
            }
            return '';
        }

        getFormato(card:iDataApirest) {
            if( !card || !card.attributes ) {
                return null;
            }
            if(!card.attributes.formato) {
                card.attributes.formato = "post";
            }

            return card.attributes.formato;
        }

        getRelevancia(card:iDataApirest) {
            if( !card || !card.attributes ) {
                return null;
            }
            if(!card.attributes.relevancia) {
                var relevancia = ["1-4","2-4","3-4","4-4"];
                var item = Math.floor((Math.random() * 4));
                card.attributes.relevancia = relevancia[item];
            }

            return card.attributes.relevancia;
        }

        setAttributes(contents,attributes) {
            var newContents = [];
            angular.forEach(contents,function(content,key) {
                content.attributes = jQuery.extend({},content.attributes,attributes);
                newContents.push(content);
            });

            return newContents;
        }

        changeCarrouselToAlbum(contents) {
            var newContents = [];
            angular.forEach(contents,function(content,key) {
                if(content.attributes.formato == 'carrousel') {
                    content.attributes.formato = 'album';
                }
                newContents.push(content);
            });

            return newContents;
        }

        getLinkAutores(content){
            var output = 'Buho';
            if(content && content.relationships && content.relationships.usuarios && content.relationships.usuarios.data) {
                var autores = content.relationships.usuarios.data[0];
                if(content.relationships.usuarios.data.length > 1) {
                    autores = content.relationships.usuarios.data[1];
                }
                if(!autores.attributes) {
                    autores.attributes = {
                        nickname:this.controller.$config.name,
                        avatar:this.controller.$config.protocolCdn + this.controller.$config.cdn+'/images/foto-perfil.jpg'
                    };
                }
                var nickname = autores.attributes.nickname;
                var username = autores.id;
                var avatar = autores.attributes.avatar;
                var seguidor = '';
                if(autores.attributes.meSigueEl == "1" ) {
                    seguidor = 'seguidor';
                }
                //Ninguno es clicable en V1:
                if(jQuery.inArray(username,this.controller.$config.adminNames) == -1) {
                    output = this.controller.$sce.trustAsHtml('<a title="Autor" href="'+this.controller.$state.href('perfil',{username:username})+'"><span class="mod-avatar-img '+seguidor+'"><img src="'+avatar+'"></span><span itemprop="author">'+ this.controller._main.capitalizeFirstLetter(nickname)+'</span></a>');
                }else {
                    output = this.controller.$sce.trustAsHtml('<span class="mod-avatar-img"><img src="'+avatar+'"></span><span itemprop="author">'+this.controller._main.capitalizeFirstLetter(nickname)+'</span>');
                }
            }
            return output;
        }

        isLinkBuho(content){
            if(content && content.relationships && content.relationships.usuarios && content.relationships.usuarios.data && content.relationships.usuarios.data[0]) {
                var autores = content.relationships.usuarios.data[0];
                if(content.relationships.usuarios.data.length > 1) {
                    autores = content.relationships.usuarios.data[1];
                }
                var username = autores.id;
                if(jQuery.inArray(username,this.controller.$config.adminNames) != -1) {
                    return true;
                }else {
                    return false;
                }
            }else {
                return true;
            }
        }

        isMine(content) {
            if(content && content.relationships && content.relationships.usuarios && content.relationships.usuarios.data && content.relationships.usuarios.data[0] && this.controller._user.currentUser) {
                if(content.relationships.usuarios.data[0].id == this.controller._user.username) {
                    return true;
                }
            }
            return false;
        }

        setMine(content) {
            this.controller._main.setMine(this.controller.isMine(content));
        }

        classBuho(content){
            if(content && content.relationships && content.relationships.usuarios && content.relationships.usuarios.data && content.relationships.usuarios.data[0]) {
                var autores = content.relationships.usuarios.data[0];
                if(content.relationships.usuarios.data.length > 1) {
                    autores = content.relationships.usuarios.data[1];
                }
                var username = autores.id;
                if(jQuery.inArray(username,this.controller.$config.adminNames) != -1) {
                    return this.controller.$config.name;
                }else {
                    return 'usuario';
                }
            }else {
                return this.controller.$config.name;
            }
        }

        getCuerpo(content) {
            if(content && 
               content.attributes && 
               content.attributes.cuerpo && 
               content.attributes.cuerpo != '--NO-CONTENT--'  && 
               content.attributes.cuerpo != '<p>-1</p>'
            ) {
                var res = content.attributes.cuerpo;
                res = this.controller.filterNoContent(res);
                res = this.controller.filterEspacios(res);
                res = this.controller.filterHashtag(res);

                var div = $('<div>').html(res);
                div.find('iframe').wrap("<p class='content-video'/>");

                if(content.attributes.formato != 'html_block') {
                    //div.find('script').remove();
                }
                var str = div.html();
               return this.controller.$sce.trustAsHtml(str);
            }
            return '';
        }

        initGallery() {

            var self = this;

            var template = '\
                    <a class="link link-lightgallery" href="##url##" data-sub-html="##description##">\
                        <img src="##url##" alt="##alt##" title="##title##" width="##width##" height="##height##"/>\
                        <div class="album-wrapper-poster">\
                            <img src="images/zoom.png">\
                        </div>\
                    </a>';

            setTimeout(function() {
                var figures = angular.element('.dtl-cuerpo figure');
                var images = angular.element('.dtl-cuerpo img');

                images.each(function(index) {
                    if(angular.element(this).parent( "a" ).length > 0) {
                        return null;
                    }

                    var url = angular.element(this).attr('src') || '';
                    var title = angular.element(this).attr('title') || '';
                    var alt = angular.element(this).attr('alt') || '';
                    var width = angular.element(this).attr('width') || '';
                    var height = angular.element(this).attr('height') || '';
                    var description = "";
                    var templateTmp = template;

                    if(angular.element(this).parent( "figure" ).length > 0) {
                        description = angular.element(this).parent('figure').find('figcaption').text();
                    }

                    templateTmp = templateTmp.replace(new RegExp('##url##', 'g'),url);
                    templateTmp = templateTmp.replace("##title##",title);
                    templateTmp = templateTmp.replace("##alt##",alt);
                    templateTmp = templateTmp.replace("##width##",width);
                    templateTmp = templateTmp.replace("##height##",height);
                    templateTmp = templateTmp.replace("##description##",description);

                    angular.element(this).replaceWith(templateTmp);

                });

                var $lg = $(".dtl-cuerpo");

                //Le paso la referencia al controlador principal para luego poder controlarlo con el backbutton del dispositivo
                self.controller._main.selectorLightGallery = ".dtl-cuerpo";

                $lg.lightGallery({
                    thumbnail:true,
                    animateThumb: true,
                    selector: '.link',
                    showThumbByDefault: false,
                    download: false,
                    preload:0
                }); 

                $lg.on('onBeforeOpen.lg',function(event){
                    self.controller._main.extendsOmniture({prop29:'fotogaleria',eVar29:'fotogaleria'});
                    self.controller._main.sendOmniture();
                    self.controller._main.isOpenLightGallery = true;
                });

                $lg.on('onCloseAfter.lg',function(event){
                    self.controller._main.isOpenLightGallery = false;
                });

                $lg.on('onBeforeSlide.lg',function(event, index, fromTouch, fromThumb){
                    self.controller._main.extendsOmniture({prop29:'fotogaleria',eVar29:'fotogaleria'});
                    self.controller._main.sendOmniture();
                });

            },100);

        }

        initPlayBuzz(card) {
            setTimeout(function() {
                PlayBuzz.core.render();
            },100);
        }

        initInstagram(card) {
            setTimeout(function() {
                instgrm.Embeds.process();
            },1000);
        }

        getCuerpoTarjeta(content) {
            if(content && content.attributes && content.attributes.cuerpoTarjeta && content.attributes.cuerpoTarjeta != '--NO-CONTENT--' && content.attributes.cuerpo != '<p>-1</p>' ) {
                var res = content.attributes.cuerpoTarjeta;
                res = this.controller.filterEspacios(res);
                res = this.controller.filterHashtag(res);
                var div = $('<div>').html(res);
                div.find('iframe').wrap("<p class='content-video'/>");
                if(content.attributes.formato != 'html_block'){
                    div.find('script').remove();
                }
                var str = div.html();
               return this.controller.$sce.trustAsHtml(str);
            }
            return '';
        }

        existLeyendaMiniaturas(card:iDataApirest) {
            if(card && card.attributes && card.attributes.preview && card.attributes.preview.description) {
                return true;
            }
            else if(card && card.relationships && card.relationships.miniaturas && card.relationships.miniaturas.data && card.relationships.miniaturas.data[0] && card.relationships.miniaturas.data[0].leyenda  && card.relationships.miniaturas.data[0].leyenda != "&nbsp;" && card.relationships.miniaturas.data[0].leyenda != "-1") {
                return true;
            }
            return false;
        }

        existCopyrightMiniaturas(card:iDataApirest) {
            if(card && card.attributes && card.attributes.preview && card.attributes.preview.canonicalUrl) {
                return true;
            }
            else if(card && card.relationships && card.relationships.miniaturas && card.relationships.miniaturas.data && card.relationships.miniaturas.data[0] && card.relationships.miniaturas.data[0].copyright  && card.relationships.miniaturas.data[0].copyright != "&nbsp;" && card.relationships.miniaturas.data[0].copyright != "-1") {
                return true;
            }
            return false;
        }
    }

}