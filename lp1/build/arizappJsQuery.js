
class arizappJsQuery {
    constructor() {
        this.query = '';
    }

    /**
    * @public
    * @param {string|HTMLElement|Array<string|HTMLElement>|undefined|null} $query
    * @param {string|HTMLElement|Array<string|HTMLElement>|undefined|null} $referenceElement
    * @returns {Array<HTMLElement>}
    */
    get($query, $referenceElement) {
        return (new aElementsManager($query, $referenceElement)).elements;
    }

    /**
     * 
     * @param {{with_credentials?:boolean; response_type?:string; headers?:Record<string,string>; method?:"GET"|"POST"|"PUT"|"PATH"|"DELETE"; url?:string; data?:Record<string,any>; success?:(response:Record<string,any>) => void; error?:(responseError:{responseJSON:any});onReadyStateChange?:(state:any) => void; xhr_rewriter?:(xhr:XMLHttpRequest) => XMLHttpRequest; }} ajaxOptions 
     */
    ajax(ajaxOptions) {
        return (new aAjax()).setUp(ajaxOptions);
    }
}

class aElementsManager {

    /**
     * 
     * @param {string|HTMLElement|Array<string|HTMLElement>|undefined|null} $query
     * @param {string|HTMLElement|Array<string|HTMLElement>|undefined|null} $referenceElement
     */
    constructor($query, $referenceElement) {
        /**
         * @type {Array<HTMLElement}
         */
        this.elements = [];
        this.setElement($query, $referenceElement);
    }

    /**
     * @private
     * @param {string|HTMLElement|Array<string|HTMLElement>|undefined|null} $query
     * @param {string|HTMLElement|Array<string|HTMLElement>|undefined|null} $referenceElement
     */
    setElement($query, $referenceElement) {
        this.elements = this.getElements($query, $referenceElement);
    }
    /**
     * @private
     * @param {string|HTMLElement|Array<string|HTMLElement>|undefined|null} $query
     * @param {string|HTMLElement|Array<string|HTMLElement>|undefined|null} $referenceElement
     */
    getElements($query, $referenceElement) {
        if ($query === null || typeof $query === 'undefined') {
            return [];
        }
        if ($query instanceof HTMLElement) {
            return [$query];
        }
        if ($query instanceof NodeList) {
            return Object.values($query);
        }
        if (typeof $query === 'object' && !(Array.isArray($query))) {
            $query = Object.values($query);
        }

        if (Array.isArray($query)) {
            var queryChildrenNodeLists = [];
            for (var queryIndex = 0; queryIndex < $query.length; queryIndex++) {
                try {
                    queryChildrenNodeLists.concat(Object.values(this.setElement($query[queryIndex], $referenceElement)));
                } catch (e) {
                    console.log('Error in getElements when try to concate children node list to query at position ' + queryIndex + ':', $query[queryIndex], e);
                    continue;
                }
            }
            return queryChildrenNodeLists;
        }
        if (!(typeof $query === 'string')) {
            return [];
        }
        if ($referenceElement === null || typeof $referenceElement === 'undefined') {
            return Object.values(this.getElementsFromQuery($query));
        }
        if (typeof $referenceElement === 'string') {
            return Object.values(this.getElementsFromNodeList($query, this.getElementsFromQuery($referenceElement)));
        }
        if ($referenceElement instanceof NodeList || $referenceElement instanceof HTMLElement || (Array.isArray($referenceElement) && $referenceElement[0] instanceof HTMLElement)) {
            return Object.values(this.getElementsFromNodeList($query, $referenceElement));
        }
        console.log('No condition catch for: ', $query, $referenceElement);
        return Object.values(this.getElementsFromQuery($query));
    }

    /**
     * 
     * @param {string} $query 
     */
    getElementsFromQuery($query) {
        if ($query === null || typeof $query !== 'string') {
            return [];
        }
        return document.querySelectorAll($query);
    }

    /**
     * 
     * @param {string} $query 
     * @param {Array<string|HTMLElement>|NodeList|HTMLElement} $nodeList 
     */
    getElementsFromNodeList($query, $nodeList) {
        if ($nodeList instanceof HTMLElement) {
            $nodeList = [$nodeList];
        }
        if ($nodeList.length < 1) {
            return [];
        }
        if ($query === null || typeof $query !== 'string') {
            return [];
        }
        if (!($nodeList instanceof NodeList || $nodeList[0] instanceof HTMLElement)) {
            return [];
        }
        var referencesChildrens = [];
        for (var i = 0; i < $nodeList.length; i++) {
            try {
                var childrensNode = $nodeList[i].querySelectorAll($query);
                if (!(childrensNode instanceof NodeList)) {
                    continue;
                }
                referencesChildrens = referencesChildrens.concat(Object.values(childrensNode));
            } catch (e) {
                console.log(e);
                continue;
            }
        }
        return referencesChildrens;
    }
}

class aAjax {
    constructor() {
        /**
         * @type {{with_credentials?:boolean; response_type?:string; headers?:Record<string,string>; method?:"GET"|"POST"|"PUT"|"DELETE"; url?:string; data?:Record<string,any>; success?:(response:Record<string,any>) => void; error?:(responseError:{responseJSON:any});onReadyStateChange?:(state:any) => void; xhr_rewriter?:(xhr:XMLHttpRequest) => XMLHttpRequest; }}
         */
        this.ajax_options = {};
        this.xhr = new XMLHttpRequest();
    }

    /**
     * 
     * @param {{with_credentials?:boolean; response_type?:string; headers?:Record<string,string>; method?:"GET"|"POST"|"PUT"|"PATH"|"DELETE"; url?:string; data?:Record<string,any>; success?:(response:Record<string,any>|any) => void; error?:(responseError:{responseJSON:any}|any);onReadyStateChange?:(state:any) => void; xhr_rewriter?:(xhr:XMLHttpRequest) => XMLHttpRequest; }} ajaxOptions 
     */
    setUp(ajaxOptions) {
        console.log('1');
        this.ajax_options = ajaxOptions;
        try {
            this.xhr.withCredentials = ajaxOptions?.with_credentials && ajaxOptions.with_credentials || false;
            this.xhr.responseType = ajaxOptions?.response_type && ajaxOptions.response_type || 'json';
            this.xhr.open((ajaxOptions?.method && ajaxOptions.method || 'GET'), (ajaxOptions?.url && ajaxOptions.url || window.location.href));
        } catch (e) {
            throw new Error('Erro ao definir opcionais da requisição! ' + e.message);
        }
        console.log('2');
        try {
            for (var headerName in (ajaxOptions?.headers && ajaxOptions.headers || {})) {
                this.xhr.setRequestHeader(headerName, ajaxOptions.headers[headerName]);
            }
        } catch (e) {
            throw new Error('Erro ao definir headers! ' + e.message);
        }
        console.log('3');
        try {
            var dataToSend = this.formatDataToSend(ajaxOptions);
            console.log('dataToSend: ', dataToSend);
            this.xhr.onerror = ajaxOptions?.error && ajaxOptions.error || function (err) {
                console.log(err);
                return false;
            }
        } catch (e) {
            throw new Error('Erro ao definir função de callback para erro! ' + e.message);
        }
        console.log('4');
        try {
            var successFunction = ajaxOptions?.success && ajaxOptions.success || function (responseData) {
                console.log('Success ajax response: ', responseData);
            }
        } catch (e) {
            throw new Error('Erro ao definir função de callback para sucesso! ' + e.message);
        }
        try {
            var onReadyStateChangeFunction = ajaxOptions?.onReadyStateChange && ajaxOptions?.onReadyStateChange || function (state) {
                console.log('State has changed: ', state);
            }
        } catch (e) {
            throw new Error('Erro ao definir função de callback para mudança de estado! ' + e.message);
        }
        try {
            this.xhr.addEventListener('readystatechange', function () {
                try {
                    if (this.readyState === this.DONE) {
                        successFunction(this.response);
                    }
                } catch (e) {
                    throw new Error('Erro ao executar função de callback sucesso nas mudanças de estado padrão! ' + e.message);
                }
                try {
                    onReadyStateChangeFunction(this.readyState);
                } catch (e) {
                    throw new Error('Erro ao executar função de callback de mudanças de estado nas mudanças de estado padrão! ' + e.message);
                }
            }, false);
        } catch (e) {
            throw new Error('Erro ao executar função de callback para mudança de estado! ' + e.message);
        }
        try {
            //Continuar DAQUI
            var customXhrFunction = ajaxOptions?.xhr_rewriter && ajaxOptions.xhr_rewriter || function (xhrInstance) {
                console.log('Nenhuma reescrita da instância xhr: ', xhrInstance);
                return true;
            }
            if (customXhrFunction(this.xhr) === false) {
                return;
            }
        } catch (e) {
            throw new Error('Erro ao executar função customizada da herança de instancia da requisição! ' + e.message);
        }
        try {
            this.xhr.send(dataToSend);
            return;
        } catch (e) {
            throw new Error('Erro ao enviar requisição! ' + e.message);
        }
    }

    /**
     * 
     * @param {{with_credentials?:boolean; response_type?:string; headers?:Record<string,string>; method?:"GET"|"POST"|"PUT"|"PATH"|"DELETE"; url?:string; data?:Record<string,any>; success?:(response:Record<string,any>) => void; error?:(responseError:{responseJSON:any}); xhr_rewriter?:(xhr:XMLHttpRequest) => XMLHttpRequest; }} ajaxOptions 
     */
    formatDataToSend(ajaxOptions) {
        //console.log('ajaxOptions:', ajaxOptions);
        var data = null;
        if (typeof ajaxOptions !== 'object' || Array.isArray(ajaxOptions) || !(ajaxOptions?.data && true || false) || typeof ajaxOptions.data !== 'object' || Array.isArray(ajaxOptions.data)) {
            return data;
        }
        //console.log('headers: ', ajaxOptions?.headers);
        try {
            if (!ajaxOptions?.headers) {
                ajaxOptions.headers = {};
            }

            if (('Content-Type' in ajaxOptions.headers) ? (ajaxOptions.headers['Content-Type'].indexOf('x-www-form-urlencoded') >= 0 ? true : false) : false) {
                data = Object.entries((ajaxOptions?.data || {})).map(dataValue => {
                    return dataValue[0] + '=' + encodeURI(dataValue[1]);
                }).join('&');
                return data;
            }
            data = new FormData();
            for (var fieldName in (ajaxOptions?.data && ajaxOptions.data || {})) {
                data.append(fieldName, ajaxOptions.data[fieldName]);
            }
        } catch (e) {
            console.log(e);
        }
        return data;
    }

}

var Z = new arizappJsQuery();
