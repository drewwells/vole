
define([
	'flight/component',
	'jquery',
	'app/events',
	'app/api',
	'lib/handlebars',
	'text!tmpl/post.hbs',
    'app/config'
], function (component, $, events, API, Handlebars, postTmpl, Config) {

	function timeline () {

		this.defaultAttrs({
			postListSelector: '#posts-loaded',
			loadMoreSelector: '.load-more'
		});

		this.start = function () {
			this.getNewPosts();

			this.interval = setInterval(function () {
				this.getNewPosts();
			}.bind(this), 5000);
            this.socket();
        };

        this.start = function () {
			var params = {};
            var ws;
            API.user().done(function(user){
			    if (!user) {
                    return;
                }

                ws = new WebSocket("ws://" + Config.server.listen +
                                   "/entry");

                ws.onmessage = function(ev) {
                    var model = JSON.parse(ev.data);
                    console.log(model);
                };
                API.init(ws, { user: user.id });
            });
        };

		this.stop = function () {
			if (this.interval) {
				clearInterval(this.interval);
			}
		};

		this.clear = function () {
			this.posts = [];
			this.select('postListSelector').empty();
		};

		this.getNewPosts = function () {
			var params = {};

			if (this.user) {
				params.user = this.user.id;
			}

			API.posts(params).done(function (posts) {
				posts.reverse().forEach(function (post) {
					if (this.posts.length === 0) {
						this.prependPost(post);
					}
					// If this post is newer than the most recent
					// post in the timeline, add it.
					else if (post.created >= this.posts[0].created &&
							post.id !== this.posts[0].id) {
						this.prependPost(post);
					}
				}, this);
			}.bind(this));
		};

		this.appendPost = function (post) {
			this.posts.push(post);
			var html = Handlebars.compile(postTmpl)(post);
			this.select('postListSelector').append(html);
		};

		this.prependPost = function (post) {
			this.posts.unshift(post);
			var html = Handlebars.compile(postTmpl)(post);
			this.select('postListSelector').prepend(html);
		};

		this.viewMyProfile = function () {
			API.user()
				.done(function (user) {
					this.user = user;
					this.start();
				}.bind(this))
				.fail(function () {
					$(document).trigger(events.PROFILE_NOT_FOUND);
				});
		};

		this.viewHome = function () {
			this.user = null;
			this.start();
		};

		this.loadMore = function () {
			if (!this.posts.length) {
				this.getNewPosts();
			}
			else {
				var params = {
					user: this.user ? this.user.id : '',
					before: this.posts[this.posts.length - 1].id
				};

				API.posts(params).done(function (posts) {
					posts.forEach(this.appendPost, this);
				}.bind(this));
			}
		};

		this.after('initialize', function () {
			this.posts = [];

			$(document).on(events.VIEW_MY_PROFILE, $.proxy(this.viewMyProfile, this));
			$(document).on(events.VIEW_HOME, $.proxy(this.viewHome, this));

			this.on('click', {
				loadMoreSelector: this.loadMore
			});
		});

		// Auto start.
		this.after('initialize', this.start);

		// Auto stop before starting.
		this.before('start', this.stop);
		this.before('start', this.clear);
	}

	return component(timeline);

});
