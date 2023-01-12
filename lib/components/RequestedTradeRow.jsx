import PropTypes from 'prop-types';
import StatusEnum from '../statusEnum';

function TradeActionRow({ trade, onClick }) {
  return (
    <>
      <button
        type="button"
        className="btn btn-success mt-3"
        onClick={() => {
          onClick(trade.id, 1);
        }}
      >
        Accept
      </button>
      {' '}
      <button
        type="button"
        className="btn btn-danger mt-3"
        onClick={() => {
          onClick(trade.id, 2);
        }}
      >
        Reject
      </button>
    </>
  );
}

TradeActionRow.propTypes = {
  trade: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export function TradeBookList({ heading, children }) {
  return (
    <div>
      <h2 className="h4 w-100 mt-2">
        {heading}
      </h2>
      {children}
    </div>
  );
}

TradeBookList.propTypes = {
  heading: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};

export function RequestedTradeRow({
  trade, isRequester, currentUserBookList, otherUserBookList,
}) {
  return (
    <div key={trade.id} className="mb-3 p-3 border">
      <strong>Created:</strong>
      {' '}
      {new Date(trade.createdAt).toLocaleString('en-US')}
      <br />
      <strong>Status:</strong>
      {' '}
      {StatusEnum[trade.status]}
      <br />
      <strong>Updated:</strong>
      {' '}
      {new Date(trade.updatedAt).toLocaleString('en-US')}
      <br />
      {trade.status === 0 && !isRequester && (
        <TradeActionRow trade={trade} />
      )}
      <div className="d-flex">
        {otherUserBookList}
        {currentUserBookList}
      </div>
    </div>
  );
}

RequestedTradeRow.propTypes = {
  trade: PropTypes.shape({
    id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
  }).isRequired,
  isRequester: PropTypes.bool.isRequired,
  currentUserBookList: PropTypes.instanceOf(TradeBookList).isRequired,
  otherUserBookList: PropTypes.instanceOf(TradeBookList).isRequired,
};
