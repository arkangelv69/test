/// <reference path="../../typings/jquery/jquery.d.ts"/>

interface JQuery {
	popover: any;
	masonry: any;
	lightGallery: any;
	simplecolorpicker: any;
	cropper: any;
	modal: any;
	tooltip: any;
	waypoint: any;
	select2: any;
	destroy(action?): any;
	sideNav(params?):any;
	carousel(params?):any;
	collapsible(params?):any;
	characterCounter(params?):any;
	material_select(params?):any;
	materialize_autocomplete(params?):any;
	pickadate(params?):any;
}

interface HTMLElement {
	naturalWidth: any;
	naturalHeight: any;
	width: any;
	height: any;
	getContext(type): any;
	toDataURL(img): any;
}

interface Object {
	_sessionToken: string;
}

interface JQueryXHR {
	success(response?);
}

module ILovePlatos{

	export interface IBuhoModule extends ng.IModule {
	}

	export interface IBuhoRootScopeService extends ng.IRootScopeService {
		$$childHead: any;
		ngMeta:any;
	}

	export interface IMainScope extends ng.IScope {
		_user:any;
		id:string;
		position:any;
		categoria:string;
		searched:boolean;
		prevState:string;
		intervalMessages:any;
		intervalConversaciones:any;
		intervalNotificaciones:any;
		intervalPaginaVista:any;
		preview:any;
		existState(nameState:string): boolean;
		getState(nameState:string): EntityController;
		removeState(nameState);
		updateState(nameState:string, state): void;
		getDateFromFecha(fecha:string):Date;
		getCurrentDateInString():string;
		capitalizeFirstLetter(string):string;
		setTitle(string);
		goBack(string?,params?);
		setPrevious(string,object?);
		setMessage(object);
		resetMessages();
		toggleMessageLogin();
		toggleShare();
		setId(id:string);
		setMenuId(menuId:string);
		initTinymce(selector?,timeout?);
		showLogin();
		hideLogin();
		regenereWall(selector?);
		setContentBuho(isContent);
		setMine(isMine);
		go(name:string,params?);
		setCache(name:string);
		deleteAllCache();
		deleteCache(name:string);
		redirect404();
		activeTooltip();
		setOmniture(params,action?);
		extendsOmniture(params);
		sendOmniture();
		sendGoogleAnalytics();
		cleanRelativeUrl(url:string):string;
		setCustomClass(customClass:any);
		setChartBeat(options);
		initChartBeat();
		$scope:any;
		goToScrollTop(event?):any;
		homepublicarpostCtrl:any;
		setTTLAdvise(name,ttl?);
		selectorLightGallery:string;
		isOpenLightGallery:boolean;
		isCordovaApp();
	}

	export interface IUserScope extends ng.IScope {
		currentUser:any;
		userNeo4j:number;
		username:string;
		nickname:string;
		description:string;
		imagePerfil:string;
		imageBackground:string;
		colorBackground:string;
		completeRegister:boolean;
		landings:any;
		deviceId:any;
		isLogged():any;
		updateMeta(meta,value);
		getUsernameByUsuario(item):string;
		getNicknameByUsuario(item):string;
		getAvatarByUsuario(item):string;
		setPromocode(promocode:string);
		isMyPageByUrl();
		saveUserInStorageLocal();
		updateProfile(attributes);
	}
	export interface IVideoScope extends ng.IScope {
	}

	export interface IComentarioScope extends ng.IScope {
		comentarioForm:string;
		processPublicarPost:any;
		finishCuerpo:boolean;
		finishImages:boolean;
		finishVideo:boolean;
	}

	export interface ICompartirScope extends ng.IScope {
		type:string;
		url:string;
		contenidoCtrl:any;
		mainCtrl:IMainScope;
	}

	export interface IRepostScope extends ng.IScope {
		contenidoCtrl:any;
		mainCtrl:IMainScope;
	}

	export interface IFileImageScope extends ng.IScope {
		type:string;
		url:string;
		template:string;
		contenidoCtrl:any;
		mainCtrl:IMainScope;
	}

	export interface IFileVideoScope extends ng.IScope {
		type:string;
		url:string;
		template:string;
		contenidoCtrl:any;
		mainCtrl:IMainScope;
	}


	export interface ILoginScope extends ng.IScope {
		mainCtrl:IMainScope;
	}

	export interface ICardAttributes extends ng.IAttributes {
		formato:string;
		relevancia:string;
		loadedclass:string;
		tipoDeModulo:string;
		fondoColor:string;
		transparenciaColor:string;
		colorTextoContenedorTarjeta:string;
		color:string;
		card:any;
	}

	export interface IFileImageAttributes extends ng.IScope {
		type:string;
		url:string;
		template:string;
		mainCtrl:IMainScope;
	}

	export interface IBuscadorPerfilesAttributes extends ng.IScope {
		mainCtrl:IMainScope;
		template:string;
	}

	export interface IFileVideoAttributes extends ng.IScope {
		type:string;
		url:string;
		template:string;
		mainCtrl:IMainScope;
	}

	export interface ISliderAttributes extends ng.IAttributes {
		id:string;
		template:string;
		content:any;
		type:string;
		index:string;
	}

	export interface IScrollAttributes extends ng.IAttributes {
		scroll:any;
		scrollWallSelector:string;
	}

	export interface IMainAugmentedJQuery extends ng.IAugmentedJQuery {
		popover();
	}

	export interface iAttributesModel {
		id:string;
    		titulo: string;
	    	cuerpo: string;
	    	subtitulo: string;
	    	formato: string;
	    	relevancia:string;
	    	preview:any;
	    	usarImagenDeFondo:string;
	    	numeroDeReposts:string;
	    	fecha?:string;
	    	positivo?:number;
	    	negativo?:number;
	    	miniaturas:any;
	    	colorDeFondo:any;
	    	imagenDeFondo:any;
	    	colorDeCapaTransparente:any;
	    	colorTextoContenedorTarjeta:any;
	    	tipoDeModulo:any;
	    	mostrarMiniaturaDentro:number;
	    	urlDestino:string;
	    	slug:string;
    	}

	export interface iDataApirest{
	    type: string;
	    id: string;
	    attributes?:iAttributesModel;
	    relationships?: {
	    	autor?: string;
	    	comentarios?: Array<any>;
	    	categorias?:any;
	    	imagenes?: Array<any>;
	    	videos?: any;
	    	recursos?: Array<any>;
	    	miniaturas?: any;
	    	galerias?: any;
	    	colorDeFondo?: any;
	    	imagenDeFondo?: any;
	    	colorDeCapaTransparente?: any;
	    	colorTextoContenedorTarjeta?: any;
	    	tipoDeModulo?: any;
	    	childrens?: any;
	    };
	    included?:any;
	    done?: boolean;
	}

    	export interface iMainModel {
    	}

    	export interface iUserModel {

    	}

}
