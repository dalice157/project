import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { showAreaText } from '../../util/commonUtil';
import Card from './Card';

class CardList extends PureComponent {
  render() {
    const {
      isMobile, data, fileMap, areaData, choice, loading, addFavoriteGig, removeFavoriteGig, catNo, chkActiveProcess, location,
    } = this.props;
    const isTutor = (choice === '1000000');
    return (
      <>
        {
          data.map(card => (
            <Card
              isMobile={isMobile}
              key={card.gigId}
              isTutor={isTutor}
              card={card}
              fileMap={fileMap}
              areaData={areaData}
              loading={loading}
              addFavoriteGig={addFavoriteGig}
              removeFavoriteGig={removeFavoriteGig}
              showAreaText={showAreaText}
              catNo={catNo}
              chkActiveProcess={chkActiveProcess}
              location={location}
            />
          ))
        }
      </>
    );
  }
}

export default withRouter(CardList);
