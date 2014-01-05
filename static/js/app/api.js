
define([
  'app/config',
  'jquery'
],
function (Config, $) {

    var messageQueue = [];

	return {

        //ws
        ready : false,

        onmessage : function (ev) {
            var model = JSON.parse(ev.data);
            console.log('Message received:', model);
        },

        onopen : function (ev) {
            this.ready = true;

            while (messageQueue.length) {
                var message = messageQueue.pop();
                console.log(message);
                this.ws.send(message);
            }
        },

        init : function (ws, params) {
            var self = this;
            this.ws = ws;
            ws.onmessage = this.onmessage;
            ws.onopen = function(ev){
                this.onopen.call(self, ev);
            };

            var message = JSON.stringify(params);
            if (this.ready) {
                this.ws.send(message);
            } else {
                messageQueue.push(message);
            }
        },

		posts : function (params) {

			var dfd = $.Deferred();

			$.get('/api/posts', params || {}).done(function (result) {
				if (result && result.posts) {
					dfd.resolve(result.posts);
				}
				else {
					dfd.reject();
				}
			});

			return dfd.promise();
		},

		user : function () {
			var dfd = $.Deferred();

			$.get('/api/users?is_my_user=true').done(function (result) {
				if (result && result.users.length) {
					dfd.resolve(result.users[0]);
				}
				else {
					dfd.reject();
				}
			});

			return dfd.promise();
		},

		createUser : function (name, email) {
			var body = JSON.stringify({
				user : {
					name : name,
					email : email
				}
			});

			return $.ajax({
				type: 'POST',
				url: '/api/users',
				data: body,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json'
			});
		},

		post : function (title) {
			var body = JSON.stringify({
				post : {
					title : title
				}
			});

			return $.ajax({
				type: 'POST',
				url: '/api/posts',
				data: body,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json'
			});
		}

	};

});
