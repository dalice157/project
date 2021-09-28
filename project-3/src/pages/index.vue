<script>
import MainPaths from '~/common/LinkPath';

export default {
  asyncData(context) {
    context.redirect(MainPaths.cService);
  }
};
</script>
