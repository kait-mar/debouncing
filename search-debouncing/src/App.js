import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { useQuery } from 'react-query';
import { useDebounce } from '@uidotdev/usehooks';

const fetchData = async (value) => await axios.get(
  `https://api.giphy.com/v1/gifs/search?api_key=UC6QeKH1sTZwo7OgHc1oAJJu4JFV59TJ&q=${value}&limit=25&offset=0&rating=g&lang=e
  n`
);

function App() {
  const [tag, setTag] = useState('');
  const [images, setImages] = useState();

  // useEffect(() => {
  //   const getData = setTimeout(handleApi, 4000);
  //   return () => clearTimeout(getData);
  // }, [tag]);

  const debouncedTag = useDebounce(tag, 3000);
  const { data } = useQuery(['myData', debouncedTag], () =>
    fetchData(debouncedTag)
  );

  useEffect(() => {
    if (data) {
      let {data: {data: imageData} } = data;
      let img = imageData.map(elem => {
        const {images: {original: {url}}} = elem;
        return url;
      })
  
      img = img.map((image, index) => (
        <Col key={index} sm={3}>
          <div className="square-container">
            <img src={image} alt={`Image ${index + 1}`} className="grid-image" />
          </div>
        </Col>
      ))
      setImages(img);
    }
  }, [data])



  const handleChange = (event) => {
    setTag(event.target.value);
  }

  return (
    <div className="App">
      <header className="App-header">
      <form>
        <input placeholder="Search Input.." value={tag} onChange={handleChange} style={{margin: '20px'}} />
      </form>
      {images &&
      <Container>
        <Row className="image-grid">
          {images}
        </Row>
      </Container>
      }
      </header>
    </div>
  );
}

export default App;
