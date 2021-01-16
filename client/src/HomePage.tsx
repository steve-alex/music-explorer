import React, { useEffect, useState } from 'react';
import API from './Api';
import './HomePage.scss';

enum ContentType {
  artists = 'artists',
  tracks = 'tracks'
}

enum TimeRange {
  shortTerm = 'short_term',
  mediumTerm = 'medium_term',
  longTerm = 'long_term'
}

const HomePage = ({access_token}: any) => {
  const [contentType, setContentType] = useState(ContentType.artists);
  const [timerange, setTimerange] = useState(TimeRange.shortTerm);
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errors, setErrors] = useState(null);
  //TODO - Make this TS enums;

  useEffect(() => {
    API.getItems(contentType, timerange, access_token)
      .then((items: any) => {
        setItems(items.data);
        setIsLoaded(true);
      });
  }, [])

  useEffect(() => {
    API.getItems(contentType, timerange, access_token)
      .then((items: any) => {
        setItems(items.data);
        setIsLoaded(true);
      });
  }, [contentType])

  useEffect(() => {
    API.getItems(contentType, timerange, access_token)
      .then((items: any) => {
        setItems(items.data);
        setIsLoaded(true);
      });
  }, [timerange])

  const displayItems = (): any => {
    if (contentType === ContentType.artists){
      return renderArtists();
    } else if (contentType === ContentType.tracks){
      return renderTracks();
    }
  }

  const renderArtists = (): any => {
    console.log("Load artists");
    return items.map((item: any) => {
      console.log(item);
      return (
        <div className="item-container" key={item.id}>
          <img src={item.images[0].url} />
          <p>{item.name}</p>
        </div>
      )
      // TODO - Highlight this and redirect to Spotify album profile
    })
  }

  const renderTracks = () => {
    console.log('Load tracks');
    return items.map((item: any) => {
      console.log(item);
      return (
        <div className="item-container" key={item.id}>
          <img src={item.album.images[0].url} />
          <p>{item.name}</p>
        </div>
      )
      // TODO - Highlight this and redirect to Spotify album profile
    })
  }

  return (
    <div>
      <div>Top
        <span className={contentType === ContentType.artists ? 'enabled' : 'disabled'}
          onClick={() => {setIsLoaded(false); setContentType(ContentType.artists)}}>
          Artists 
        </span>
        <span className={contentType === ContentType.tracks ? 'enabled' : 'disabled'}
          onClick={() => {setIsLoaded(false); setContentType(ContentType.tracks);}}>
          Songs
        </span>
      </div>
      <div>
        <span className={timerange === TimeRange.shortTerm ? 'enabled' : 'disabled'}
          onClick={() => {setIsLoaded(false); setTimerange(TimeRange.shortTerm);}}>
          4 Weeks
        </span>
        <span className={timerange === TimeRange.mediumTerm ? 'enabled' : 'disabled'}
          onClick={() => {setIsLoaded(false); setTimerange(TimeRange.mediumTerm);}}>
          Last 6 Months
        </span>
        <span className={timerange === TimeRange.longTerm ? 'enabled' : 'disabled'}
          onClick={() => {setIsLoaded(false); setTimerange(TimeRange.longTerm);}}>
          All Time
        </span>
      </div>
      <div className="items-container">{isLoaded ? displayItems() : 'hello'}</div>
    </div>
  )
};

export default HomePage;
