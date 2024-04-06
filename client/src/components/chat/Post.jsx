import PropTypes from 'prop-types';

export default function Post({name, body}){

  return (
    <div className='post'>
      <div className='post-header'><span>{name}</span></div>
      <div className='post-text'>{body}</div>
    </div>
  );
}

Post.propTypes = {
  name:PropTypes.string.isRequired,
  body:PropTypes.string.isRequired
}

