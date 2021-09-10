import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadWordpressAnnouncementTitle } from '../../actions/wordpress';
import icon from '../../img/index_v2/announcement-icon.svg';
import styles from './Announcement.scss';

class Announcement extends Component {
  componentDidMount() {
    this.props.initAnnouncement();
  }

  render() {
    return (
      <div className={styles.news}>
        <div className={styles.wrap}>
          <img src={icon} alt="系統公告" /><span className={styles.title}>系統公告：</span>
          {
            this.props.announcePublished && (
            <a href={this.props.announceLink} target="_blank" data-gtm-nav="公告">
              { this.props.announceTitle }
            </a>
            )
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    announceTitle: state.wordpress.announcement.title,
    announcePublished: state.wordpress.announcement.isPublished,
    announceLink: state.wordpress.announcement.link,
  };
};

const mapDispatchToProps = { initAnnouncement: loadWordpressAnnouncementTitle };
export default connect(mapStateToProps, mapDispatchToProps)(Announcement);
