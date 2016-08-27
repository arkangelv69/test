/**
 * @ngdoc service
 * @name ngMeta.ngMeta
 * @description
 * # A metatags service for single-page applications
 * that supports setting title, description, open-graph and twitter card meta tags
 */
angular.module('ngMeta', [])
    .provider('ngMeta', function () {

        'use strict';

        var defaults = {
            title: '',
            titleSuffix: '',
            description: '',
            keywords: '',
            ogImage: '',
            ogTitle: '',
            ogType: '',
            ogUrl: '',
            twitterTitle: '',
            twitterDescription: '',
            twitterImage: '',
            twCard: ''
        };

        var config = {
            name: 'ngMeta',
            useTitleSuffix: false,
            ogType: 'website',
            ogSiteName: '',
            ogLocale: 'en_US',
        };

        //Constructor
        function Meta($rootScope) {

            var self = this;

            var setTitle = function (title, titleSuffix) {
                $rootScope[config.name].title = title || defaults.title;
                if (config.useTitleSuffix) {
                    $rootScope[config.name].title += titleSuffix || defaults.titleSuffix;
                }
            };

            var setDescription = function (description) {
                $rootScope[config.name].description = description || defaults.description;
            };

            var setKeywords = function (keywords) {
                $rootScope[config.name].keywords = keywords || defaults.keywords;
            };

            var setOgTitle = function (ogTitle) {
                $rootScope[config.name].ogTitle = ogTitle || defaults.ogTitle;
            };

            var setOgType = function (ogType) {
                $rootScope[config.name].ogType = ogType || defaults.ogType;
            };

            var setOgUrl = function (ogUrl) {
                $rootScope[config.name].ogUrl = ogUrl || defaults.ogUrl;
            };

            var setOgImage = function (ogImage) {
                $rootScope[config.name].ogImage = ogImage || defaults.ogImage;
            };

            var setTwitterTitle = function (twitterTitle) {
                $rootScope[config.name].twitterTitle = twitterTitle || defaults.twitterTitle;
            };

            var setTwitterDescription = function (twitterDescription) {
                $rootScope[config.name].twitterDescription = twitterDescription || defaults.twitterDescription;
            };

            var setTwitterImage = function (twitterImage) {
                $rootScope[config.name].twitterImage = twitterImage || defaults.twitterImage;
            };

            var readRouteMeta = function (meta) {
                meta = meta || {};
                setTitle(meta.title, meta.titleSuffix);
                setDescription(meta.description);
                setKeywords(meta.keywords);
                setOgTitle(meta.ogTitle);
                setOgType(meta.ogType);
                setOgUrl(meta.ogUrl);
                setOgImage(meta.ogImage);
                setTwitterTitle(meta.twitterTitle);
                setTwitterDescription(meta.twitterDescription);
                setTwitterImage(meta.twitterImage);
            };

            var update = function (event, current) {
                readRouteMeta(current.meta);
            };

            var setDefault = function (object) {
                defaults = jQuery.extend(defaults,object);
                readRouteMeta(defaults);
            };

            $rootScope[config.name] = {};
            $rootScope[config.name].ogType = config.ogType;
            $rootScope[config.name].ogSiteName = config.ogSiteName;
            $rootScope[config.name].ogLocale = config.ogLocale;
            $rootScope[config.name].ogTitle = config.ogTitle;
            $rootScope[config.name].ogUrl = config.ogUrl;
            $rootScope[config.name].ogImage = config.ogImage;
            $rootScope.$on('$routeChangeSuccess', update);
            $rootScope.$on('$stateChangeSuccess', update);

            return {
                'setDefault': setDefault,
                'setTitle': setTitle,
                'setDescription': setDescription,
                'setKeywords': setKeywords,
                'setOgTitle': setOgTitle,
                'setOgType': setOgType,
                'setOgUrl': setOgUrl,
                'setOgImage': setOgImage,
                'setTwitterTitle': setTwitterTitle,
                'setTwitterDescription': setTwitterDescription,
                'setTwitterImage': setTwitterImage
            };
        }

        /* Set defaults */

        this.setDefault = function (object) {
            defaults = jQuery.extend(defaults,object);
        };

        /* One-time config */

        this.setName = function (varName) {
            config.name = varName;
        };

        this.useTitleSuffix = function (bool) {
            config.useTitleSuffix = !!bool;
        };

        this.setOgType = function (type) {
            config.ogType = type;
        };

        this.setOgSiteName = function (siteName) {
            config.ogSiteName = siteName;
        };

        this.setOgLocale = function (locale) {
            config.ogLocale = locale;
        };

        // Method for instantiating
        this.$get = ["$rootScope", function ($rootScope) {
            return new Meta($rootScope);
        }];
    });