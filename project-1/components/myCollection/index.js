import React, { PureComponent } from 'react';
import { showAreaText } from '../../util/commonUtil';
import Card from './Card';

class CardList extends PureComponent {
  render() {
    const {
      data, fileMap, areaData, choice, loading, addFavoriteGig, removeFavoriteGig, chkActiveProcess,
    } = this.props;
    const isTutor = (choice === '1000000');
    return (
      <>
        {
          data.map((card, index) => (
            <Card
              key={card.gigId || index}
              isTutor={isTutor}
              card={card}
              fileMap={fileMap}
              areaData={areaData}
              loading={loading}
              addFavoriteGig={addFavoriteGig}
              removeFavoriteGig={removeFavoriteGig}
              showAreaText={showAreaText}
              chkActiveProcess={chkActiveProcess}
            />
          ))
        }
      </>
    );
  }
}

export default CardList;
