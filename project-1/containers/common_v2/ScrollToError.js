import { Component } from 'react';

class ScrollToError extends Component {
  componentDidUpdate(prevProps) {
    if (prevProps.isSubmitting && !this.props.isSubmitting && !this.props.isValid) {
      if (Object.keys(this.props.errors).length > 0) {
        this.onScrollTop();
      }
    }
  }

  onScrollTop = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
  }

  render() {
    return null;
  }
}

export default ScrollToError;
