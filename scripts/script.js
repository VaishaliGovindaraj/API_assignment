$(() => {

    const API_KEY = "6b6386d7a3f8ce3ce396cb88600dbc7a";
    let favMusic = {};

    const getDetails = async () => {
        $('.facts').text("");
        let response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=tag.getTopArtists&tag=tamil&api_key=${API_KEY}&format=json`);
        let musicData = await response.json();
        let musicFacts = musicData.topartists.artist;

        musicFacts.forEach(item => {
            const artistName = item.name;
            const imageUrl = "./images/Music.jpg";
            const songsUrl = item.url;

            const artistDiv = `
                <div class="artist" data-name="${artistName}" data-url="${songsUrl}">
                    <img src="${imageUrl}" alt="${artistName}">
                    <a href="${songsUrl}" target="blank">${artistName}</a>
                </div>`;
            $('.facts').append(artistDiv);
        });

        bindArtistClick();
    };

    const bindArtistClick = () => {
        $('.artist').on('click', function () {
            const name = $(this).data('name');
            const url = $(this).data('url');
            $('.artist-card .card-content').html(`
                <h2>${name}</h2>
                <a href="${url}" target="blank">More Details</a>
            `);
            $('.artist-card').fadeIn();
        });

        $('.artist-card .close').on('click', function () {
            $('.artist-card').fadeOut();
        });
    };

    const searchSongbyArtist = async () => {

        let search_input = $('#search_by_artist').val();

        try {
            let response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${encodeURIComponent(search_input)}&api_key=${API_KEY}&format=json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let allArtistData = await response.json();

            if (allArtistData.toptracks && allArtistData.toptracks.track) {
                $('.facts').empty();

                let allArtistDetails = allArtistData.toptracks.track;
                allArtistDetails.forEach((artist, index) => {

                    let artistName = artist.artist.name;
                    let songName = artist.name;
                    let playCount = artist.playcount;
                    let songURL = artist.url;

                    const artistDiv = `<div class="artist artist_details">
                        <span class="all_artist_name"> Artist Name : ${artistName}</span>
                        <div class="song_name"> Song Title: ${songName}</div>
                        <div class="playcount"> Playcount : ${playCount}</div>
                        <a href=${songURL} target="blank"> Listen here : ${songName}</a>
                        <button class="fav_button">Add as Favourite</button>
                    </div>`;

                    $('.facts').append(artistDiv);

                    $(`.fav_button:eq(${index})`).on("click", async () => {
                        favMusic = {
                            favArtistName: artist.artist.name,
                            favsongName: artist.name,
                            favsongURL: artist.url
                        };
                        localStorage.setItem("favMusicDetails", JSON.stringify(favMusic));

                    });
                })
            } else {
                $('.facts').empty();
                const errorDiv = '<div class="error_description">No tracks found for the artist.</div>'
                $('.facts').append(errorDiv);
                console.error("No tracks found for the artist.");
            }
        } catch (error) {

            console.error(error);
        }

    }

    const displayFavSongs = (favsong) => {
        $('.facts').text("");
        $('.facts').append(`<div class="fav_artist artist_details">
                        <span class="all_artist_name"> Artist Name : ${favsong.favArtistName}</span>
                        <div class="song_name"> Song Title: ${favsong.favsongName}</div>
                        <a href=${favsong.favsongURL} target="blank"> Listen here: ${favsong.favsongName}</a>
                         </div>`);

    }

    const searchbyalbum = async () => {

        let searchByAlbum = $('#search_by_album').val();
        console.log(searchByAlbum);

        if (!searchByAlbum) {
            $('.facts').empty();
            $('.facts').append('<div class="error_description">No album found. Please enter an album name.</div>');
            return;
        }

        try {
            let response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(searchByAlbum)}&api_key=${API_KEY}&format=json`);
            let albumData = await response.json();
            console.log(albumData.results.albummatches);
            albumDetailfetch = albumData.results.albummatches;

            if (!albumDetailfetch || albumDetailfetch.length === 0) {
                $('.facts').empty();
                $('.facts').append('<div class="error_description">No album found.</div>');
                console.error("No album found.");
                return;
            }

            $('.facts').empty();
            let albumDetails = albumDetailfetch.album;

            albumDetails.forEach(album => {

                let artistName = album.artist;
                let albumName = album.name;
                let albumImageArray = album.image[3];
                let albumImage = albumImageArray['#text'];
                let albumURL = album.url;

                const artistDiv = `<div class="artist artist_details">
                        <span class="all_artist_name"> Artist Name : ${artistName}</span>
                        <div class="song_name"> Album Title: ${albumName}</div>
                        <img class="albumimage" src="${albumImage}" alt="Album Art">
                        <a href=${albumURL} target="blank"> Listen here : ${albumName}</a>
                    </div>`;

                $('.facts').append(artistDiv);

            })
        } catch (error) {
            console.error(error);
        }

    }

    $('.search_album').on("click", searchbyalbum);
    $('.search_artist').on("click", getDetails);
    $(`.search_any_artist`).on("click", searchSongbyArtist);
    $('.fav_display').on("click", () => {
        let savedSong = localStorage.getItem("favMusicDetails");
        if (savedSong) {
            displayFavSongs(JSON.parse(savedSong));
        }
    }
    );


})
