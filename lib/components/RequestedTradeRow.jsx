import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import TradeStatusEnum from '../tradeStatusEnum';

import UPDATE_TRADE from '../graphql/UpdateTrade.gql';

import ErrorNotification from './ErrorNotification';

function TradeActionRow({ trade, refetch }) {
  const [updateTrade, { loading, error, reset }] = useMutation(UPDATE_TRADE);
  return (
    <>
      {error && <ErrorNotification message="Unable to take action on trade. Please try again." onDismiss={reset} />}
      <button
        type="button"
        className="btn btn-success mt-3"
        onClick={async () => {
          await updateTrade({
            variables: { id: trade.id, status: TradeStatusEnum.Names.ACCEPTED },
          });
          refetch();
        }}
        disabled={loading}
      >
        Accept
      </button>
      {' '}
      <button
        type="button"
        className="btn btn-danger mt-3"
        onClick={async () => {
          await updateTrade({
            variables: { id: trade.id, status: TradeStatusEnum.Names.REJECTED },
          });
          refetch();
        }}
        disabled={loading}
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
  trade, isRequester, requestedBookList, receivingBookList, refetch,
}) {
  return (
    <div key={trade.id} className="mb-3 p-3 border">
      <strong>Created:</strong>
      {' '}
      {new Date(trade.createdAt).toLocaleString('en-US')}
      <br />
      <strong>Status:</strong>
      {' '}
      {TradeStatusEnum.Values[trade.status]}
      <br />
      <strong>Updated:</strong>
      {' '}
      {new Date(trade.updatedAt).toLocaleString('en-US')}
      <br />
      {trade.status === TradeStatusEnum.Names.PENDING && !isRequester && (
        <TradeActionRow trade={trade} refetch={refetch} />
      )}
      <div className="d-flex">
        {receivingBookList}
        {requestedBookList}
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
  requestedBookList: PropTypes.instanceOf(TradeBookList).isRequired,
  receivingBookList: PropTypes.instanceOf(TradeBookList).isRequired,
  refetch: PropTypes.func.isRequired,
};
