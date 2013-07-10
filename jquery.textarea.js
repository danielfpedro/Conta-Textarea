(function($){
	$.fn.textarea = function(options){
		

		var defaults = {
			'progressive' : false,
			'limit' : 400,
			'regularColor' : 'green',
			'overColor' : 'red',
			'alertColor' : 'orange',
			'over' : true,
			'alertLimit' : 70,
			'counter' : '',
			'bar' : '',
		};

		//As opções que não forem passadas pelo usuário serão usadas default
		var options = $.extend({},defaults,options);

		//Calcula a partir de quanto a cor do contador recebera o valor de alert, ou seja, quase atingindo o limite
		//var alert = (limit * options.alertLimit) / 100;
		//Inicializa os valores do contador
		if(options.counter != ''){
			var alert = (options.limit * options.alertLimit) / 100;
			var valor = options.limit;
			if(options.progressive){
				valor = 0;
			}
			$(options.counter).text(valor).css({'color' : options.regularColor});
		}
		//Inicializa valores da barra
		if(options.bar != ''){
			//Cria a barra dentro do container especificado
			var $b = $('div').attr('id','barra').css({'background-color':'red','height':'80px'});
			$(options.bar).append($b).attr('id','teste');
			$b.attr('id','bar');
			//$b.attr('id',options.bar);
			var valor = 100;
			if(options.progressive)
				valor = 0;
			$(options.bar).css({'width' : valor + '%'});
		}


		var flagShake = 0;

		this.keyup(function(){
			var atual = $(this).val().length;

			if(atual > options.limit && flagShake == 0){
				shake($(this));
				flagShake = 1;
			}
			if(atual < options.limit && flagShake == 1){
				flagShake = 0;
			}

			if (atual > options.limit && options.over == false) {
				$(this).val($(this).val().substring(0,options.limit));
			};

			if(!options.progressive){ //Se regressivo
				var valorCounter = options.limit - atual;
				var p = (100*valorCounter)/options.limit;

				if (options.counter != '' && options.over == false){ //Se possuir contador
					if (valorCounter < 0){
						var valorCounter = 0;
					}
				}
				if (options.bar != ''){
					if (valorCounter < 0)//Evitar estouro da barra
						var p = 0;
				}

			}else{
				var valorCounter = atual;
				var p = (100*atual)/options.limit;

				if (options.counter != '' && options.over == false){ //Se possuir contador
					if (atual > options.limit){
						var valorCounter = options.limit;
					}
				}

				if (options.bar != ''){
					if (atual > options.limit)//Evitar estouro da barra
						var p = 100;
				}
			}

			if (options.counter != ''){ //Se possuir contador
				//Setando cores
				if (atual >= alert && atual <= options.limit) {
					$(options.counter).css({'color' : options.alertColor});
				}else if(atual > options.limit){
					$(options.counter).css({'color' : options.overColor});
				}else{
					$(options.counter).css({'color' : options.regularColor});
				};

				$(options.counter).text(valorCounter);
			}

			if (options.bar != ''){ //Se possuir contador
				$(options.bar).animate({'width' : p + '%'});
			}
			//$('#debug').text('porcentagem: ' + p + ' - atual: ' + atual + ' alert:' + alert);
		}).keydown(function(){
			if ($(this).val().length > options.limit && options.over == false) {
					$(this).val($(this).val().substring(0,options.limit));
				};
		});
	}

	function shake($this){
		$this.animate({'margin-left':'-=2px'}, 30, function(){
			$this.animate({'margin-left':'+=4px'}, 30,function(){
				$this.animate({'margin-left':'-=2px'}, 30,function(){
					$this.animate({'margin-left':'-=2px'}, 30, function(){
						$this.animate({'margin-left':'+=4px'}, 50,function(){
							$this.animate({'margin-left':'-=2px'}, 50);
						});
					});
				});
			});
		});
	}

})(jQuery);