--Get win loss ratio for each player
select *,
       Round(div0(wins, losses), 2) as win_loss_ratio
from   (select player,
               Sum(case
                     when outcome = 'Won' then 1
                     else 0
                   end) as Wins,
               Sum(case
                     when outcome = 'Lost' then 1
                     else 0
                   end) as Losses
        from   matchresults
        group  by player)
order  by Round(div0(wins, losses), 2) desc;

--Get total matches won per player
select player,
       Sum(matches_won) as total_matches_won
from   sfl_jpn.public.matchresults
group  by player
order  by Sum(matches_won) desc;  


--Get characters used to win battles
select character,
       Count(outcome) as battles_won
from   matchresults
where  outcome = 'Won'
group  by character
order  by Count(outcome) desc; 

--Get all players who defeated the top player named Gatchikun
select player,
       character,
       matches_won
from   public.matchresults
where  result_id in(select result_id
                    from   public.matchresults
                    where  outcome = 'Lost'
                           and player = 'RB|Gachikun')
       and outcome = 'Won'; 