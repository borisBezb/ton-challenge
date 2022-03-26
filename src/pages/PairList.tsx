import {
  FC,
  useEffect,
  useState,
} from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  addToFavourites,
  fetchPairList,
  removeFromFavourites,
} from '../store/ton/slice';
import {
  AppDispatch,
  RootState,
} from '../store';
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Skeleton,
  Tabs,
  Tab,
  Tooltip
} from '@mui/material';
import {
  Star as StarIcon,
  StarOutline as StarOutlineIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { IPairMeta } from '../store/ton/interfaces';

const PairList: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [tab, setTab] = useState<string>('all');

  const { favorites, list, status } = useSelector((state: RootState) => state.ton)

  useEffect(() => {
    dispatch(fetchPairList());
  }, [dispatch]);

  const handleChangeTab = (e: React.SyntheticEvent, val: string) => {
    setTab(val);
  };

  const handleAddFavourite = (poolAddress: string) => {
    dispatch(addToFavourites(poolAddress));
  };

  const handleRemoveFavourite = (poolAddress: string) => {
    dispatch(removeFromFavourites(poolAddress));
  };

  const data = tab === 'all'
    ? list
    : list.filter((item) => favorites.includes(item.poolAddress))
  ;

  return (
    <Card sx={{ width: 600, overflow: 'auto', maxHeight: '100%' }}>
      <CardContent>
        <Tabs value={tab} onChange={handleChangeTab} aria-label="basic tabs example">
          <Tab label="Trading pairs" value="all" />
          <Tab label="Favorites" value="favorites" />
        </Tabs>
        <List>
          {
            status !== 'succeed' && Array.from({ length: 15 }).fill(1).map((_, i) => (
              <ListItem
                key={i}
                divider={true}
                secondaryAction={
                  <Skeleton variant="circular" width={20} height={20} />
                }
              >
                <ListItemText>
                  <Skeleton animation="wave" height={14} width={100} />
                </ListItemText>
              </ListItem>
            ))
          }
          {
            status === 'succeed' && data.map((item: IPairMeta) => (
              <ListItem
                key={item.poolAddress}
                divider={true}
                secondaryAction={
                  favorites.includes(item.poolAddress)
                    ?
                    <Tooltip title="Remove from favorites" placement="right" arrow>
                      <IconButton onClick={() => handleRemoveFavourite(item.poolAddress)}>
                        <StarIcon/>
                      </IconButton>
                    </Tooltip>
                    :
                    <Tooltip title="Add to favorites" placement="right" arrow>
                      <IconButton onClick={() => handleAddFavourite(item.poolAddress)}>
                        <StarOutlineIcon/>
                      </IconButton>
                    </Tooltip>
                }
              >
                <ListItemText>
                  <Link to={`pairs/${item.poolAddress}`}>{item.base}/{item.counter}</Link>
                </ListItemText>
              </ListItem>
            ))
          }
        </List>
      </CardContent>
    </Card>
  );
}

export default PairList;
