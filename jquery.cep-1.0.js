/*!
 * jQuery CEP v1.0
 * By Michel Banagouro
 * http://mbanagouro.net/site
 */
(function ($) {

	//cache results
	var cache = {};

	// default configuration options
	var defaultOptions = {
		load: function () { },
		complete: function () { },
		success: function (endereco) { },
		error: function (msg) { }
	};

    $.cep = function ( cep, options ) {
		
		var settings = $.extend({}, defaultOptions, options);

		cep = cep.replace(/[^0-9]+/g, '');
		cep = $.trim(cep);

		if (cep.length != 8) {
			return;
		}
		
		if (cep in cache) {
			settings.success(cache[cep]);
			return;
		}
		
		settings.load();
		
		$.getScript('http://cep.republicavirtual.com.br/web_cep.php?formato=javascript&cep=' + cep, function () {
			
			settings.complete();

			var data = {
				tipoLogradouro: unescape(resultadoCEP['tipo_logradouro']),
				logradouro: unescape(resultadoCEP['logradouro']),
				cidade: unescape(resultadoCEP['cidade']),
				bairro: unescape(resultadoCEP['bairro']),
				estado: unescape(resultadoCEP['uf']),
				resultado: unescape(resultadoCEP['resultado']),
				resultadoTxt: unescape(resultadoCEP['resultado_txt']),
			};

			if (data.resultado == '0') {
				settings.error("Endereço não encontrado. Verifique o CEP que você digitou.");
			} else {
				cache[cep] = data;
				settings.success(data);
			}

		});
		
    };
	
	$.fn.cep = function ( options ) {
		this.each(function () {
			$.cep($(this).val(), options);			
		});
	}

})(jQuery);